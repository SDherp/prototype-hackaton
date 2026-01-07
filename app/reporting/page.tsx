"use client"
import { Sidebar } from "@/components/sidebar"
import { ReportingContent } from "@/components/reporting-content"

export default function ReportingPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ReportingContent />
      </main>
    </div>
  )
}
