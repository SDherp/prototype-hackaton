"use client"

import { useRef, useState } from "react"
import { X, HelpCircle, Plus, FileText, ChevronDown, Upload } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AssetRow {
  id: number
  asset: string
  year: string
}

interface DocumentFile {
  id: number
  name: string
  isSaved: boolean
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [assets, setAssets] = useState<AssetRow[]>([{ id: 1, asset: "", year: "2025" }])
  const [category, setCategory] = useState("")
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const addAsset = () => {
    setAssets([...assets, { id: Date.now(), asset: "", year: "2025" }])
  }

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const MAX_DOCUMENTS = 12
    const remainingSlots = MAX_DOCUMENTS - documents.length

    if (remainingSlots <= 0) {
      alert("Maximum of 12 files can be uploaded.")
      event.target.value = ""
      return
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots)

    const newDocs: DocumentFile[] = filesToAdd.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      isSaved: false,
    }))

    setDocuments((prev) => [...prev, ...newDocs])
    // reset input so same file can be selected again later
    event.target.value = ""
  }

  const removeDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const closeDocumentsModal = () => {
    setShowDocumentsModal(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal - Made modal more rounded */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[750px] mx-4">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Processing File Upload</h2>

          {/* Asset Rows */}
          <div className="space-y-3">
            {assets.map((row, index) => (
              <div key={row.id} className="flex items-start gap-4">
                {/* Target Asset */}
                <div className="flex-1">
                  {index === 0 && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-red-500">*</span>
                      <span className="text-sm text-gray-700">Target Asset</span>
                      <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  )}
                  <div className="relative">
                    <select
                      value={row.asset}
                      onChange={(e) => {
                        const newAssets = [...assets]
                        newAssets[index].asset = e.target.value
                        setAssets(newAssets)
                      }}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2aa39f]"
                    >
                      <option value="">Select Asset</option>
                      <option value="asset1">Asset 1</option>
                      <option value="asset2">Asset 2</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Target Year */}
                <div className="w-[120px]">
                  {index === 0 && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-red-500">*</span>
                      <span className="text-sm text-gray-700">Target Year</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={row.year}
                    onChange={(e) => {
                      const newAssets = [...assets]
                      newAssets[index].year = e.target.value
                      setAssets(newAssets)
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2aa39f]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Button - Made more rounded */}
          <button
            onClick={addAsset}
            className="flex items-center gap-1 mt-3 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>

          {/* Warning */}
          <p className="text-center text-[#2aa39f] text-sm mt-4 mb-6">Please upload monthly report files only</p>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-[200px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2aa39f]"
                >
                  <option value="">Select Category</option>
                  <option value="cat1">Category 1</option>
                  <option value="cat2">Category 2</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowDocumentsModal(true)}
                className="p-2 border border-[#2aa39f] rounded-lg text-[#2aa39f] hover:bg-[#e6f7f5] transition-colors"
                type="button"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons - Made buttons more rounded */}
          <div className="flex justify-end gap-3">
            <button className="px-8 py-2 bg-[#2aa39f] text-white rounded-lg text-sm font-medium hover:bg-[#239089] transition-colors">
              Submit
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 border border-[#2aa39f] text-[#2aa39f] rounded-lg text-sm font-medium hover:bg-[#e6f7f5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showDocumentsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeDocumentsModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <button
              onClick={closeDocumentsModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">Documents</h3>
              <div className="flex justify-end mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".json,.xlsx,.xls,.doc,.docx,.pdf,.jpeg,.jpg,.png"
                  onChange={handleAddFiles}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-[#2aa39f] text-[#2aa39f] rounded-lg text-sm font-medium hover:bg-[#e6f7f5] transition-colors"
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                  Add Files
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-gray-700 font-medium">File Name</th>
                      <th className="text-left px-4 py-2 text-gray-700 font-medium">Is Saved</th>
                      <th className="text-left px-4 py-2 text-gray-700 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                          No Data
                        </td>
                      </tr>
                    ) : (
                      documents.map((document) => (
                        <tr key={document.id} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-800">{document.name}</td>
                          <td className="px-4 py-2 text-gray-600">{document.isSaved ? "Yes" : "No"}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => removeDocument(document.id)}
                              className="text-[#2aa39f] hover:underline text-sm font-medium"
                              type="button"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-[#2aa39f] text-sm mt-4">
                A maximum of 12 ((json, xlsx, doc, docx, pdf, jpeg, jpg, png)) files can be uploaded. Maximum upload file size: 8 MB per file
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={closeDocumentsModal}
                  className="px-10 py-2 border border-[#2aa39f] text-[#2aa39f] rounded-lg text-sm font-medium hover:bg-[#e6f7f5] transition-colors"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
