import { notFound } from "next/navigation"
import { AppBuilderContent } from "@/components/app-builder-content"
import { Sidebar } from "@/components/sidebar"
import { appConfig } from "@/lib/config"

export default function AppBuilderPage() {
  if (!appConfig.enableAppBuilderPage) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AppBuilderContent />
      </main>
    </div>
  )
}
