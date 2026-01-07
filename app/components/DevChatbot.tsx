"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type ChatRole = "user" | "assistant" | "system"

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: string
}

type VersionInfo = {
  id: string
  timestamp: string
  description: string
  files: Record<string, string>
}

type VersionsResponse = {
  versions: VersionInfo[]
  current: string
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  return date.toLocaleString()
}

const roleBubbleClasses: Record<ChatRole, string> = {
  user: "bg-primary text-primary-foreground ml-auto",
  assistant: "bg-muted text-foreground mr-auto",
  system: "bg-card text-muted-foreground italic mr-auto",
}

export function DevChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [versions, setVersions] = useState<VersionInfo[]>([])
  const [currentVersion, setCurrentVersion] = useState("")
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null)
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null)

  const loadVersions = async () => {
    try {
      const response = await fetch("/api/versions")
      if (!response.ok) {
        return
      }
      const data = (await response.json()) as VersionsResponse
      setVersions(data.versions || [])
      setCurrentVersion(data.current || "")
    } catch {
      // Ignore version fetch errors in the UI.
    }
  }

  useEffect(() => {
    void loadVersions()
  }, [])

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isLoading])

  const addSystemMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role: "system",
        content,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        addSystemMessage(data?.error || "Failed to apply changes.")
        return
      }

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: data.message,
            timestamp: new Date().toISOString(),
          },
        ])
      }

      if (data.errors && data.errors.length > 0) {
        addSystemMessage("Errors detected, fixing...")
        if (data.fixed) {
          addSystemMessage("Auto-fixed")
        }
      }

      const changes = Array.isArray(data.changes) ? data.changes : []
      const changeMessage = changes.length
        ? `Changes applied: ${changes.join(", ")}`
        : "Changes applied"
      addSystemMessage(changeMessage)
      void loadVersions()
    } catch (error) {
      addSystemMessage("Something went wrong while contacting the assistant.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const handleRollback = async (versionId: string) => {
    if (versionId === currentVersion || isRollingBack) {
      return
    }
    const confirmed = window.confirm("Rollback to this version? This will overwrite the current files.")
    if (!confirmed) {
      return
    }

    setIsRollingBack(versionId)
    try {
      const response = await fetch("/api/rollback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ versionId }),
      })
      if (!response.ok) {
        addSystemMessage("Rollback failed. Please try again.")
        return
      }
      addSystemMessage(`Rolled back to version ${versionId}.`)
      void loadVersions()
    } catch {
      addSystemMessage("Rollback failed. Please try again.")
    } finally {
      setIsRollingBack(null)
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <section className="flex h-full flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Dev Assistant</p>
            <h2 className="text-lg font-semibold text-foreground">Build your ESG app with prompts</h2>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">Claude Sonnet 4</span>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => {
              const isUser = message.role === "user"
              return (
                <div
                  key={message.id}
                  className={`flex max-w-[75%] flex-col gap-1 ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div className={`rounded-lg px-4 py-2 text-sm shadow-sm ${roleBubbleClasses[message.role]}`}>
                    {message.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex max-w-[75%] items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                </div>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={scrollAnchorRef} />
          </div>
        </div>

        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              rows={2}
              className="flex-1 resize-none rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              onClick={() => void sendMessage()}
              disabled={isLoading}
              className="h-[42px] rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90"
            >
              Send
            </Button>
          </div>
        </div>
      </section>

      <aside className="flex h-full w-80 flex-col border-l border-border bg-card">
        <div className="border-b border-border px-4 py-4">
          <h3 className="text-sm font-semibold text-foreground">Version history</h3>
          <p className="text-xs text-muted-foreground">Snapshots after each change.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            {versions.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
                No versions yet. Send a prompt to create your first snapshot.
              </div>
            )}
            {versions.map((version) => {
              const fileCount = Object.keys(version.files || {}).length
              const isCurrent = version.id === currentVersion
              return (
                <div
                  key={version.id}
                  className={`rounded-xl border p-3 ${
                    isCurrent ? "border-primary/60 bg-primary/5" : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{version.description}</p>
                    {isCurrent && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(version.timestamp)}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{fileCount} files</p>
                  {!isCurrent && (
                    <Button
                      variant="outline"
                      className="mt-3 w-full border-border bg-background text-xs text-foreground hover:bg-muted"
                      onClick={() => void handleRollback(version.id)}
                      disabled={isRollingBack === version.id}
                    >
                      {isRollingBack === version.id ? "Rolling back..." : "Rollback"}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
