import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { ensureVersionsDir, versionsDir, writeCurrentVersion, writeFiles } from "@/lib/dev-assistant"
import { isPathSafe } from "@/lib/project-context"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { versionId?: string }
    if (!body.versionId) {
      return NextResponse.json({ error: "versionId is required." }, { status: 400 })
    }

    await ensureVersionsDir()
    const versionPath = path.join(versionsDir, `${body.versionId}.json`)
    const raw = await fs.readFile(versionPath, "utf8")
    const version = JSON.parse(raw) as {
      id: string
      timestamp: string
      description: string
      files: Record<string, string>
    }

    const unsafePaths = Object.keys(version.files || {}).filter((filePath) => !isPathSafe(filePath))
    if (unsafePaths.length > 0) {
      return NextResponse.json(
        { error: `Unsafe file paths blocked: ${unsafePaths.join(", ")}` },
        { status: 400 },
      )
    }

    await writeFiles(version.files || {})
    await writeCurrentVersion(version.id)

    return NextResponse.json({ success: true, version })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
