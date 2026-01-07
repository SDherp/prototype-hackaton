import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import Anthropic from "@anthropic-ai/sdk"
import { ensureVersionsDir, versionsDir, writeCurrentVersion, writeFiles } from "@/lib/dev-assistant"
import {
  findRelevantFiles,
  generateFileTree,
  getKeyFiles,
  getProjectDependencies,
  isPathSafe,
  readFileContent,
} from "@/lib/project-context"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

type ClaudeResponse = {
  message: string
  files: Record<string, string>
}

const execAsync = promisify(exec)

const baseSystemPrompt = `You are an expert Next.js developer assistant.
You have full visibility of project structure and existing files (provided below).
When modifying existing files, preserve structure.
Always provide COMPLETE file contents, never snippets.
Response format: JSON only with {message, files: {path: content}}.`

const extractJson = (text: string) => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error("Claude response did not include JSON.")
  }
  return JSON.parse(match[0]) as ClaudeResponse
}

const runTypeScriptCheck = async () => {
  try {
    await execAsync("npx tsc --noEmit --skipLibCheck", {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10,
    })
    return { ok: true, output: "" }
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string }
    const output = [err.stdout, err.stderr, err.message].filter(Boolean).join("\n")
    return { ok: false, output }
  }
}

const formatProjectContext = async (userPrompt: string) => {
  const [fileTree, dependencies, keyFiles, relevantFiles] = await Promise.all([
    generateFileTree(),
    getProjectDependencies(),
    getKeyFiles(),
    findRelevantFiles(userPrompt),
  ])

  const uniqueFiles = Array.from(new Set([...keyFiles, ...relevantFiles]))
  const fileEntries: Array<{ path: string; content: string }> = []

  for (const filePath of uniqueFiles) {
    const content = await readFileContent(filePath)
    if (content) {
      fileEntries.push({ path: filePath, content })
    }
  }

  const filesSection = fileEntries.length
    ? fileEntries.map((entry) => `File: ${entry.path}\n${entry.content}`).join("\n\n")
    : "No files included."

  return [
    "PROJECT STRUCTURE:",
    fileTree || "(empty)",
    "",
    "DEPENDENCIES:",
    JSON.stringify(dependencies, null, 2),
    "",
    "EXISTING FILES:",
    filesSection,
  ].join("\n")
}

const callClaude = async (messages: ChatMessage[], projectContext: string) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.")
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const normalizedMessages = messages.map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.role === "system" ? `System: ${message.content}` : message.content,
  }))

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: [
      { type: "text", text: baseSystemPrompt },
      { type: "text", text: projectContext, cache_control: { type: "ephemeral" } },
    ],
    messages: normalizedMessages,
  })

  const text = response.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n")
  return { data: extractJson(text), usage: response.usage }
}

const validateFiles = (files: Record<string, string>) => {
  const unsafePaths = Object.keys(files).filter((filePath) => !isPathSafe(filePath))
  if (unsafePaths.length > 0) {
    throw new Error(`Unsafe file paths blocked: ${unsafePaths.join(", ")}`)
  }
}

const buildFixPrompt = (prompt: string, files: Record<string, string>, errors: string) => `
The TypeScript compilation failed. Please fix the errors.

Original prompt:
${prompt}

Generated files:
${JSON.stringify(files, null, 2)}

Errors:
${errors}

Return JSON with the same response format, only include files that need fixes.
`

const saveVersion = async (description: string, files: Record<string, string>) => {
  await ensureVersionsDir()
  const id = Date.now().toString()
  const version = {
    id,
    timestamp: new Date().toISOString(),
    description,
    files,
  }
  const filePath = path.join(versionsDir, `${id}.json`)
  await fs.writeFile(filePath, JSON.stringify(version, null, 2), "utf8")
  await writeCurrentVersion(id)
  return version
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] }
    const messages = Array.isArray(body.messages) ? body.messages : []
    if (messages.length === 0) {
      return NextResponse.json({ error: "Messages are required." }, { status: 400 })
    }

    const userPrompt = [...messages].reverse().find((message) => message.role === "user")?.content || "Update"
    const projectContext = await formatProjectContext(userPrompt)
    const initialResponse = await callClaude(messages, projectContext)
    const cacheReadInputTokens = initialResponse.usage?.cache_read_input_tokens ?? 0
    console.info("Claude cache read tokens:", cacheReadInputTokens)

    validateFiles(initialResponse.data.files)
    let finalMessage = initialResponse.data.message
    let appliedFiles = { ...initialResponse.data.files }

    await writeFiles(initialResponse.data.files)

    let typeCheck = await runTypeScriptCheck()
    let fixed = false
    let errorsOutput = ""
    let totalCacheReadTokens = cacheReadInputTokens

    if (!typeCheck.ok) {
      errorsOutput = typeCheck.output
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const fixResponse = await callClaude(
          [...messages, { role: "user", content: buildFixPrompt(userPrompt, appliedFiles, errorsOutput) }],
          projectContext,
        )
        totalCacheReadTokens += fixResponse.usage?.cache_read_input_tokens ?? 0
        if (fixResponse.data.files) {
          validateFiles(fixResponse.data.files)
          appliedFiles = { ...appliedFiles, ...fixResponse.data.files }
          await writeFiles(fixResponse.data.files)
        }
        if (fixResponse.data.message) {
          finalMessage = fixResponse.data.message
        }
        typeCheck = await runTypeScriptCheck()
        if (typeCheck.ok) {
          fixed = true
          break
        }
        errorsOutput = typeCheck.output
      }
    }

    if (!typeCheck.ok) {
      return NextResponse.json(
        {
          message: finalMessage,
          changes: Object.keys(appliedFiles),
          errors: errorsOutput ? [errorsOutput] : [],
          fixed: false,
          cacheStats: { cacheReadInputTokens: totalCacheReadTokens },
        },
        { status: 200 },
      )
    }

    await saveVersion(finalMessage || userPrompt, appliedFiles)

    return NextResponse.json({
      message: finalMessage,
      changes: Object.keys(appliedFiles),
      errors: errorsOutput ? [errorsOutput] : [],
      fixed,
      cacheStats: { cacheReadInputTokens: totalCacheReadTokens },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
