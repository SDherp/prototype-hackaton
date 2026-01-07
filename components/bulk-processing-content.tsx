"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Globe, Settings, Upload, ChevronDown } from "lucide-react"

interface BulkProcessingContentProps {
  onSubmitFiles: () => void
}

const files = [
  {
    name: "Electricity-Jan 2025.pdf",
    date: "05-Nov-2025",
    uploadedBy: "esgpedia-testing@stacs.io",
    status: "Success",
  },
  {
    name: "Stationary Combustion-July 2024.pdf",
    date: "30-Oct-2025",
    uploadedBy: "esgpedia-testing@stacs.io",
    status: "Success",
  },
]

export function BulkProcessingContent({ onSubmitFiles }: BulkProcessingContentProps) {
  const [year, setYear] = useState("2024")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-normal text-gray-900">Bulk Processing</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Bell className="h-4 w-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-500">English</span>
            <Globe className="h-4 w-4 text-[#2aa39f]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4 text-[#2aa39f]" />
            <span className="text-sm text-gray-500">Settings</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Year Filter and Submit Button */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1 ">Year</label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none bg-white text-[#2aa39f] px-4 py-2 pr-8 rounded-lg text-sm font-medium border-1 cursor-pointer"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2aa39f] pointer-events-none" />
            </div>
          </div>
          <button
            onClick={onSubmitFiles}
            className="flex items-center gap-2 px-4 py-2 border border-[#2aa39f] text-[#2aa39f] rounded-lg hover:bg-[#e6f7f5] transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">Submit Files</span>
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">File Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Uploaded Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Uploaded By</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                const scopeTarget = file.name.includes("Stationary Combustion") ? "scope1" : file.name.includes("Electricity") ? "scope2" : null
                const baseHref = "/reporting/form?form=ESGReport&id=6928fceb71284eb89ee5257e"
                const href = scopeTarget ? `${baseHref}&scope=${scopeTarget}` : baseHref
                return (
                <tr key={index} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-4 py-3 text-sm text-black-900">
                    <Link
                      href={href}
                      className="text-black font-small underline"
                    >
                      {file.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{file.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{file.uploadedBy}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-md border ${
                        file.status === "Processing"
                          ? "text-[#2aa39f] border-[#2aa39f] bg-white"
                          : "text-gray-600 border-gray-300 bg-white"
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 px-4 py-1.5 bg-[#2aa39f] text-white rounded-lg text-sm hover:bg-[#239089] transition-colors">
                      Action(s)
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-600">1 - 2 of 2 results</span>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">&lt;</button>
              <span className="w-6 h-6 flex items-center justify-center border border-[#2aa39f] text-[#2aa39f] rounded-md text-sm">
                1
              </span>
              <button className="text-gray-400 hover:text-gray-600">&gt;</button>
              <div className="flex items-center gap-1 ml-2 px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-600">
                10 / page
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
