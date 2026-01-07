import path from "path"
import { promises as fs } from "fs"

const projectRoot = process.cwd()
export const versionsDir = path.join(projectRoot, ".versions")

const normalizeFilePath = (filePath: string) =>
  filePath.replace(/\\/g, "/").replace(/^\/+/, "")

export const resolveProjectPath = (filePath: string) => {
  const normalized = normalizeFilePath(filePath)
  const resolved = path.resolve(projectRoot, normalized)
  if (!resolved.startsWith(projectRoot)) {
    throw new Error(`Invalid file path: ${filePath}`)
  }
  return resolved
}

export const writeFiles = async (files: Record<string, string>) => {
  const entries = Object.entries(files)
  for (const [filePath, content] of entries) {
    const resolved = resolveProjectPath(filePath)
    await fs.mkdir(path.dirname(resolved), { recursive: true })
    await fs.writeFile(resolved, content, "utf8")
  }
}

export const ensureVersionsDir = async () => {
  await fs.mkdir(versionsDir, { recursive: true })
}

export const writeCurrentVersion = async (id: string) => {
  await ensureVersionsDir()
  await fs.writeFile(path.join(versionsDir, "current.txt"), id, "utf8")
}

export const readCurrentVersion = async () => {
  try {
    const current = await fs.readFile(path.join(versionsDir, "current.txt"), "utf8")
    return current.trim()
  } catch {
    return ""
  }
}
