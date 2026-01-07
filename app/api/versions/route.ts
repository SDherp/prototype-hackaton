import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { ensureVersionsDir, readCurrentVersion, versionsDir } from "@/lib/dev-assistant"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type VersionInfo = {
  id: string
  timestamp: string
  description: string
  files: Record<string, string>
}

export async function GET() {
  try {
    await ensureVersionsDir()
    const entries = await fs.readdir(versionsDir)
    const versionFiles = entries.filter((entry) => entry.endsWith(".json"))

    const versions = await Promise.all(
      versionFiles.map(async (fileName) => {
        const raw = await fs.readFile(path.join(versionsDir, fileName), "utf8")
        return JSON.parse(raw) as VersionInfo
      }),
    )

    versions.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

    const current = await readCurrentVersion()
    return NextResponse.json({ versions, current })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
