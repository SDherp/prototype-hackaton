"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BulkProcessingContent } from "@/components/bulk-processing-content"
import { UploadModal } from "@/components/upload-modal"

export default function BulkProcessingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <BulkProcessingContent onSubmitFiles={() => setIsModalOpen(true)} />
      </main>
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
