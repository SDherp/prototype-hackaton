import path from "path"
import { promises as fs } from "fs"

const projectRoot = process.cwd()
const maxFileSizeBytes = 100 * 1024
const skipDirs = new Set(["node_modules", ".git", ".next", ".versions"])
const allowedPrefixes = ["app/", "components/", "lib/", "hooks/"]

const normalizePath = (filePath: string) => filePath.replace(/\\/g, "/").replace(/^\/+/, "")

const listFiles = async (dir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const sorted = entries.sort((a, b) => a.name.localeCompare(b.name))
    const files: string[] = []

    for (const entry of sorted) {
      if (skipDirs.has(entry.name)) {
        continue
      }
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await listFiles(fullPath)))
      } else if (entry.isFile()) {
        files.push(fullPath)
      }
    }

    return files
  } catch {
    return []
  }
}

const buildTree = async (dir: string, depth = 0): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const sorted = entries.sort((a, b) => a.name.localeCompare(b.name))
    const lines: string[] = []

    for (const entry of sorted) {
      if (skipDirs.has(entry.name)) {
        continue
      }
      const prefix = "  ".repeat(depth)
      if (entry.isDirectory()) {
        lines.push(`${prefix}${entry.name}/`)
        lines.push(...(await buildTree(path.join(dir, entry.name), depth + 1)))
      } else if (entry.isFile()) {
        lines.push(`${prefix}${entry.name}`)
      }
    }

    return lines
  } catch {
    return []
  }
}

export const generateFileTree = async () => {
  const appDir = path.join(projectRoot, "app")
  const lines = await buildTree(appDir)
  return lines.join("\n")
}

export const findRelevantFiles = async (prompt: string) => {
  const keywords = Array.from(
    new Set((prompt.toLowerCase().match(/[a-z0-9][a-z0-9-_]{2,}/g) || []).filter(Boolean)),
  )
  if (keywords.length === 0) {
    return []
  }

  const candidateRoots = ["app", "components", "lib", "hooks"]
  const candidateFiles: string[] = []

  for (const root of candidateRoots) {
    const rootPath = path.join(projectRoot, root)
    candidateFiles.push(...(await listFiles(rootPath)))
  }

  const scored = candidateFiles
    .map((filePath) => {
      const relative = normalizePath(path.relative(projectRoot, filePath))
      const lower = relative.toLowerCase()
      let score = 0
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          score += 1
        }
      }
      return { path: relative, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))

  return scored.slice(0, 8).map((entry) => entry.path)
}

export const readFileContent = async (filePath: string) => {
  try {
    const normalized = normalizePath(filePath)
    const resolved = path.resolve(projectRoot, normalized)
    if (!resolved.startsWith(projectRoot)) {
      return null
    }
    const stats = await fs.stat(resolved)
    if (!stats.isFile() || stats.size > maxFileSizeBytes) {
      return null
    }
    return await fs.readFile(resolved, "utf8")
  } catch {
    return null
  }
}

export const getProjectDependencies = async () => {
  try {
    const pkgPath = path.join(projectRoot, "package.json")
    const raw = await fs.readFile(pkgPath, "utf8")
    const parsed = JSON.parse(raw) as { dependencies?: Record<string, string> }
    return parsed.dependencies || {}
  } catch {
    return {}
  }
}

export const getKeyFiles = async () => {
  const candidates = [
    "app/globals.css",
    "styles/globals.css",
    "tailwind.config.ts",
    "tsconfig.json",
    "lib/utils.ts",
  ]
  const existing: string[] = []

  for (const filePath of candidates) {
    try {
      await fs.access(path.join(projectRoot, filePath))
      existing.push(filePath)
    } catch {
      // Skip missing key files.
    }
  }

  return existing
}

export const isPathSafe = (filePath: string) => {
  if (path.isAbsolute(filePath)) {
    return false
  }
  const normalized = normalizePath(filePath)
  if (!normalized || path.isAbsolute(normalized)) {
    return false
  }
  const parts = normalized.split("/")
  if (parts.includes("..")) {
    return false
  }
  const baseName = path.basename(normalized)
  if (baseName.startsWith(".env")) {
    return false
  }
  if (normalized.endsWith("package.json") || normalized.endsWith("next.config.js")) {
    return false
  }
  return allowedPrefixes.some((prefix) =>
    normalized === prefix.slice(0, -1) ? true : normalized.startsWith(prefix),
  )
}
