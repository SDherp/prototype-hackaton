import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function AppBuilderContent() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">App Builder</h1>
        <Button className="bg-[#2AA39F] hover:bg-[#239089] text-white">New app</Button>
      </header>

      <div className="flex-1 px-8 py-6">
        <section className="rounded-2xl border border-[#DFF0EE] bg-gradient-to-r from-[#E6F6F4] via-white to-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#238F85]">
                <Sparkles className="h-3.5 w-3.5" />
                App Builder
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">Design the app your team needs</h2>
              <p className="mt-2 text-sm text-gray-600">
                Map data flows, approvals, and automations in a single workspace built for ESG delivery teams.
              </p>
            </div>
            <div className="w-full max-w-md rounded-2xl border border-[#CDE7E5] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Assistant</p>
                  <p className="text-sm font-semibold text-gray-900">ESGpedia Copilot</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#2AA39F]" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[#F4FBFA] px-3 py-2 text-sm text-gray-700">
                  Tell me the process you want to build, and I will draft the steps.
                </div>
                <div className="flex justify-end">
                  <div className="rounded-xl bg-[#2AA39F] px-3 py-2 text-sm text-white">
                    I want a supplier onboarding app with approvals.
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
                <input
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  placeholder="Describe what you want to build..."
                />
                <Button className="h-8 rounded-full bg-[#2AA39F] px-4 text-xs text-white hover:bg-[#239089]">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
