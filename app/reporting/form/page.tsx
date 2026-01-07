"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ChevronLeft, HelpCircle, Globe, Settings, ChevronDown, Trash2, X, FileText, ScanText } from "lucide-react"

export default function ReportingFormPage() {
  const [showDataModal, setShowDataModal] = useState(false)
  const [showOcrModal, setShowOcrModal] = useState(false)
  const [ocrMonth, setOcrMonth] = useState<string | null>(null)
  const [ocrImageUrl, setOcrImageUrl] = useState<string | null>(null)
  const [ocrPdfUrl, setOcrPdfUrl] = useState<string | null>(null)
  const [ocrHighlights, setOcrHighlights] = useState<
    Array<{
      id: number | string
      label: string
      fieldKey: string
      rectangle: { x0: number; y0: number; x1: number; y1: number }
      pageIndex: number
    }>
  >([])
  const [ocrPageSize, setOcrPageSize] = useState<{ width: number; height: number } | null>(null)
  const [imageRenderSize, setImageRenderSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const scopeParam = searchParams.get("scope")
  const [isScopeOneOpen, setIsScopeOneOpen] = useState(scopeParam ? scopeParam === "scope1" : true)
  const [isScopeTwoOpen, setIsScopeTwoOpen] = useState(scopeParam ? scopeParam === "scope2" : true)
  const [showScopeTwoDataModal, setShowScopeTwoDataModal] = useState(false)
  const scopeOneRef = useRef<HTMLDivElement | null>(null)
  const scopeTwoRef = useRef<HTMLDivElement | null>(null)
  const dataMonths = [
    "Feb 2024",
    "Mar 2024",
    "Apr 2024",
    "May 2024",
    "Jun 2024",
    "Jul 2024",
    "Aug 2024",
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
    "Jan 2025",
  ]

  const openOcrPreview = async (month: string, scope: "scope1" | "scope2") => {
    setShowOcrModal(true)
    setOcrMonth(month)
    setOcrLoading(true)
    setOcrError(null)
    setOcrImageUrl(null)
    setOcrPdfUrl(null)
    setOcrHighlights([])
    setOcrPageSize(null)
    setImageRenderSize({ width: 0, height: 0 })
    try {
      const documentId = scope === "scope1" ? "bhZhRoJR" : "QwQkfAsL"
      const response = await fetch(`https://api.affinda.com/v3/documents/${documentId}`, {
        headers: {
          Authorization: "Bearer aff_fdd37889f4f429c2bb88e7bdf4438c0ee30faa7b",
          Accept: "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to load preview (${response.status})`)
      }
      const payload = await response.json()
      const pageImage = payload?.meta?.pages?.[0]?.image ?? null
      const pdfLink = payload?.meta?.pdf ?? null
      const pageWidth = payload?.meta?.pages?.[0]?.width
      const pageHeight = payload?.meta?.pages?.[0]?.height
      if (typeof pageWidth === "number" && typeof pageHeight === "number") {
        setOcrPageSize({ width: pageWidth, height: pageHeight })
      }
      const highlightEntries =
        Object.entries(payload?.data ?? {})
          .map(([fieldKey, value]) => {
            if (!value || typeof value !== "object" || !value.rectangle) {
              return null
            }
            const rect = value.rectangle
            if (
              typeof rect.x0 !== "number" ||
              typeof rect.y0 !== "number" ||
              typeof rect.x1 !== "number" ||
              typeof rect.y1 !== "number"
            ) {
              return null
            }
            return {
              id: value.id ?? fieldKey,
              label: value.raw ?? fieldKey,
              fieldKey,
              rectangle: rect,
              pageIndex: rect.pageIndex ?? 0,
            }
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []
      setOcrHighlights(highlightEntries)
      setOcrImageUrl(pageImage)
      setOcrPdfUrl(pdfLink)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error loading preview"
      setOcrError(message)
    } finally {
      setOcrLoading(false)
    }
  }

  const closeOcrModal = () => {
    setShowOcrModal(false)
    setOcrMonth(null)
    setOcrImageUrl(null)
    setOcrPdfUrl(null)
    setOcrHighlights([])
    setOcrPageSize(null)
    setImageRenderSize({ width: 0, height: 0 })
    setOcrError(null)
  }

  useEffect(() => {
    if (scopeParam === "scope1") {
      setIsScopeOneOpen(true)
      setIsScopeTwoOpen(false)
      scopeOneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else if (scopeParam === "scope2") {
      setIsScopeTwoOpen(true)
      setIsScopeOneOpen(false)
      scopeTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [scopeParam])

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Link
                href="/reporting"
                className="inline-flex items-center gap-2 text-sm text-[#2aa39f] hover:underline"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
              <span className="text-lg text-gray-900 font-semibold">Edit Asset</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                English
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <Globe className="h-4 w-4 inline mr-1 text-[#2aa39f]" />
                Reporting Year: 2025
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4 inline mr-1 text-[#2aa39f]" />
                Settings
              </button>
            </div>
          </header>

          <div className="flex flex-1">
            {/* Left navigation mimic */}
            <aside className="w-72 border-r border-gray-200 bg-white">
              <div className="px-5 py-4 text-lg font-semibold text-[#1a1a1a] border-b border-gray-200">
                Reporting
              </div>
              <nav className="px-4 py-4 text-base text-[#1a1a1a]">
                <button className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-[#f5fbfa] text-[#1a1a1a]">
                  <span className="font-semibold text-[#1a8f85]">Asset Characteristic</span>
                  <ChevronDown className="h-4 w-4 text-[#2aa39f]" />
                </button>
                <button className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-[#f5fbfa] text-[#1a1a1a]">
                  <span className="font-semibold text-[#1a8f85]">ASSET TOTAL</span>
                  <ChevronDown className="h-4 w-4 text-[#2aa39f]" />
                </button>
                <button className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-[#f5fbfa] text-[#1a1a1a]">
                  <span className="font-semibold text-[#1a8f85]">Asset 1: asset 1</span>
                  <ChevronDown className="h-4 w-4 text-[#2aa39f]" />
                </button>
                <button className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-[#f5fbfa] text-[#1a1a1a]">
                  <span className="font-semibold text-[#1a8f85]">Asset 2: Default Asset</span>
                  <ChevronDown className="h-4 w-4 text-[#2aa39f]" />
                </button>

                <div className="mt-4 mb-2 text-sm font-bold text-[#1a1a1a]">Environmental Impact</div>
                <div className="space-y-1 text-sm">
                  <div className="px-2 py-2 rounded bg-[#cbf0eb] text-[#1a8f85] font-semibold">
                    Emission and Climate Impact
                  </div>
                  <div className="px-2 py-2 text-[#1a1a1a]">Environmental Metrics</div>
                </div>

                <div className="mt-4 mb-2 text-sm font-semibold text-[#1a1a1a]">Social Impact</div>
                <div className="px-2 py-2 text-[#1a1a1a]">Our Employees</div>

                <div className="mt-4 mb-2 text-sm font-semibold text-[#1a1a1a]">Ethics and Integrity</div>
                <div className="px-2 py-2 text-[#1a1a1a]">Sustainable Governance</div>

                <div className="mt-4 mb-2 text-sm font-semibold text-[#1a1a1a]">Supplementary Disclosure</div>
                <div className="px-2 py-2 text-[#1a1a1a]">Supplementary Disclosure</div>
              </nav>
            </aside>

            {/* Form content */}
            <section className="flex-1 px-6 py-6 overflow-auto bg-white">
              {/* Top title & notes */}
              <div className="bg-white">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-[22px] font-semibold text-[#1a1a1a]">Emission and Climate Impact</h2>
                  <button className="inline-flex items-center gap-2 text-sm text-[#1a8f85] font-medium">
                    <span className="inline-block h-4 w-4 bg-[#1a8f85]/90 rounded-sm" aria-hidden />
                    Preparatory Notes
                  </button>
                </div>

                <div className="border border-[#e5e7eb] rounded-lg bg-white">
                  <div className="px-4 py-4">
                    <p className="text-sm text-[#4b5563]">
                      Please select whether you will be attaching monthly or yearly data in the assessment
                    </p>
                  </div>
                  <div className="border-t border-[#e5e7eb] px-4 py-3 flex items-center justify-end">
                    <button className="px-4 py-2 rounded bg-[#2aa39f] text-white text-sm font-semibold">monthly</button>
                    <button className="px-4 py-2 rounded bg-white text-[#4b5563] text-sm font-semibold border border-[#e5e7eb]">
                      yearly
                    </button>
                  </div>
                </div>
              </div>

              {/* Scope sections */}
              <div className="mt-6 space-y-4">
                <div ref={scopeOneRef} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsScopeOneOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-left text-base font-semibold text-[#1a1a1a]"
                    aria-expanded={isScopeOneOpen}
                  >
                    <span className="inline-flex items-center gap-2">
                      Scope 1: Direct Emissions
                      <HelpCircle className="h-4 w-4 text-[#9ca3af]" />
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6b7280] transition-transform ${
                        isScopeOneOpen ? "" : "rotate-180"
                      }`}
                    />
                  </button>

                  {isScopeOneOpen && (
                    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden bg-white">
                  <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#1a1a1a] bg-[#f9fafb]">
                    Mobile Asset Combustion
                    <ChevronDown className="h-4 w-4 text-[#6b7280] rotate-[-90deg]" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#1a1a1a] bg-[#f9fafb] border-t border-[#e5e7eb]">
                    Non-Mobile / Stationary Asset Combustion
                    <ChevronDown className="h-4 w-4 text-[#6b7280] rotate-[-90deg]" />
                  </button>

                  <div className="border-t border-[#e5e7eb] bg-white px-5 py-5">
                    <div className="text-sm text-[#1a1a1a] leading-relaxed">
                      Does this asset burn fuel(s) on-site? (Note: Fuels can include natural gas, propane, coal, fuel oil for
                      heating, diesel fuel for backup generators, biomass fuels)
                    </div>

                    <div className="flex items-center gap-6 mt-3 text-sm text-[#1a1a1a]">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="burnFuel" className="accent-[#2aa39f]" defaultChecked />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="burnFuel" className="accent-[#2aa39f]" />
                        No
                      </label>
                    </div>

                    <button className="mt-4 px-5 py-2 border border-[#c8d9d6] rounded text-sm font-medium text-[#1a8f85] bg-white hover:bg-[#f5fbfa]">
                      Add
                    </button>

                    {/* EF Source & Fuel Type */}
                    <div className="mt-6">
                      <div className="rounded-[26px] border border-[#dfe8e5] bg-white p-6 shadow-sm space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-[#1f2937] font-medium">EF Source</label>
                            <div className="relative">
                              <select className="w-full rounded-md border border-[#cedfd9] bg-[#f7fbfa] px-4 py-2.5 text-sm font-semibold text-[#0f172a] focus:outline-none">
                                <option>MfE (New Zealand)</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-[#6b7280] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-[#1f2937] font-medium">Fuel Type</label>
                            <div className="relative">
                              <select className="w-full rounded-md border border-[#cedfd9] bg-[#f7fbfa] px-4 py-2.5 text-sm font-semibold text-[#0f172a] focus:outline-none">
                                <option>Biodiesel blend b20 / litre</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-[#6b7280] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Inputs single row */}
                        <div className="rounded-[12px] border border-[#dfe8e5] bg-[#f5fbf7] px-4 py-4">
                          <div className="grid grid-cols-[1.05fr_1.15fr_1.5fr_1.45fr_auto] gap-4 text-sm text-[#1f2937] items-start">
                            <div className="flex flex-col gap-1">
                              <label className="text-sm font-medium text-[#1f2937]">Value</label>
                              <button
                                type="button"
                                onClick={() => setShowDataModal(true)}
                                className="inline-flex h-[42px] w-[84px] items-center justify-center rounded border border-[#c8d9d6] px-3 text-sm font-medium text-[#1a8f85] bg-white hover:bg-[#f5fbfa]"
                              >
                                Data
                              </button>
                            </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-[#1f2937] items-left">Total</label>
                              <div className="flex h-11 items-center rounded-md border border-[#c8d9d6] bg-white overflow-hidden ">
                                <input
                                  type="text"
                                  defaultValue="146.71586"
                                  className="flex-1 border-0 bg-transparent px-4 text-left text-base font-md text-[#6b7280]"
                                  disabled
                                />
                                <div className="flex h-full items-center border-l border-[#c8d9d6] bg-[#f0f4f5] px-4 text-[#6b7280]">
                                  litre
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-[#1f2937]">Total Activity (kWh)</label>
                              <div className="flex h-11 items-center rounded-md border border-[#c8d9d6] bg-white overflow-hidden ">
                                
                                <input
                                  type="text"
                                  defaultValue="673.28037"
                                  className="flex-1 border-0 bg-transparent px-4 text-left text-base font-md text-[#6b7280]"
                                  disabled
                                />
                                <button
                                  type="button"
                                  className="flex h-full items-center gap-1 border-l border-[#c8d9d6] bg-[#ebfcf7] px-4 text-[#1a8f85] text-sm font-semibold"
                                >
                                  kWh (Net CV)
                                  <ChevronDown className="h-3.5 w-3.5 text-[#1a8f85]" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-[#1f2937]">Calculated Emission</label>
                              <div className="flex h-11 items-center rounded-md border border-[#c8d9d6] bg-white overflow-hidden">
                                
                                <input
                                  type="text"
                                  defaultValue="146.71586"
                                  className="flex-1 border-0 bg-transparent px-4 text-left text-base font-md text-[#6b7280]"
                                  
                                  
                                />
                                <div className="flex h-full items-center gap-1 border-l border-[#c8d9d6] bg-[#f0f4f5] px-4 text-[#6b7280]">
                                  kg CO<sub>2</sub>e
                                </div>
                              </div>
                            </div>

                            <div className="flex h-full items-end justify-end pb-1">
                              <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-md border border-[#f5cfd0] bg-white text-[#de3a3a] hover:bg-[#fff6f6]"
                                aria-label="Remove fuel entry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-md border border-[#dfe8e5] bg-[#fdfdfd] px-5 py-4 flex items-center justify-between text-base font-semibold text-[#1a1a1a]">
                          <span>Total activity of non-mobile asset combustion (kWh (Net CV))</span>
                          <span className="text-[#1f2937]">673.28037 kWh (Net CV)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
                  )}
                </div>

                <div ref={scopeTwoRef} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsScopeTwoOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-left text-base font-semibold text-[#1a1a1a]"
                    aria-expanded={isScopeTwoOpen}
                  >
                    <span className="inline-flex items-center gap-2">
                      Scope 2: Indirect Emissions
                      <HelpCircle className="h-4 w-4 text-[#9ca3af]" />
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6b7280] transition-transform ${
                        isScopeTwoOpen ? "" : "rotate-180"
                      }`}
                    />
                  </button>

                  {isScopeTwoOpen && (
                    <div className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-5 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                      <div className="flex items-center gap-2 text-base font-semibold text-[#1f2937]">
                        Purchased Electricity
                        <HelpCircle className="h-4 w-4 text-[#9ca3af]" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#1a1a1a]">
                        <span>Does this asset use purchased electricity?</span>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="purchasedElectricity" defaultChecked className="accent-[#1a8f85]" />
                          Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="purchasedElectricity" className="accent-[#1a8f85]" />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#d9e5e2] bg-[#f9fbfb]">
                      <div className="flex items-center justify-between px-5 py-4">
                        <div className="text-sm font-semibold text-[#1f2937]">Location-based</div>
                        <button className="px-4 py-1.5 rounded-md border border-[#b4d4cd] text-[#1a8f85] text-sm font-semibold">
                          Add
                        </button>
                      </div>
                      <div className="space-y-5 border-t border-[#e5e7eb] bg-white px-5 py-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1f2937]">Purpose</label>
                            <div className="relative">
                              <select className="w-full rounded-md border border-[#cedfd9] bg-[#f7fbfa] px-4 py-2.5 text-sm font-semibold text-[#1a8f85] focus:outline-none">
                                <option>Electric Consumption</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-[#6b7280] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1f2937]">Grid Region</label>
                            <div className="relative">
                              <select className="w-full rounded-md border border-[#cedfd9] bg-[#f7fbfa] px-4 py-2.5 text-sm font-semibold text-[#1a8f85] focus:outline-none">
                                <option>Singapore (Energy Market Authority (Singapore))</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-[#6b7280] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-[#dfe8e5] bg-[#f5fbf7] px-4 py-4">
                          <div className="grid grid-cols-[0.6fr_1.4fr_1.2fr_1.2fr_auto] gap-4 items-start text-sm">
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium text-[#1f2937]">Value</span>
                              <button
                                type="button"
                                onClick={() => setShowScopeTwoDataModal(true)}
                                className="inline-flex h-11 w-[84px] items-center justify-center rounded-md border border-[#c8d9d6] text-sm font-semibold text-[#1a8f85]"
                              >
                                Data
                              </button>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium text-[#1f2937]">Total</span>
                              <div className="flex h-11 w-full items-center rounded-md border border-[#c8d9d6] bg-white">
                                <input
                                  type="text"
                                  defaultValue="9,346.9"
                                  className="flex-1 border-0 bg-transparent px-4 text-left text-base font-semibold text-[#6b7280]"
                                  disabled
                                />
                                <div className="flex h-full items-center border-l border-[#c8d9d6] bg-[#f0f4f5] px-4 text-[#6b7280]">
                                  kWh
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium text-[#1f2937]">Calculated Emission</span>
                              <div className="flex h-11 items-center rounded-md border border-[#c8d9d6] bg-white">
                                <input
                                  type="text"
                                  defaultValue="3,757.4538"
                                  className="flex-1 border-0 bg-transparent px-4 text-left text-base font-medium text-[#6b7280]"
                                  disabled
                                />
                                <div className="flex h-full items-center border-l border-[#c8d9d6] bg-[#f0f4f5] px-4 text-[#6b7280]">
                                  kg CO<sub>2</sub>e
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-end justify-end">
                              <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-md border border-[#f5cfd0] bg-white text-[#de3a3a] hover:bg-[#fff6f6]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-[#dfe8e5] bg-[#fdfdfd] px-5 py-4">
                        <p className="text-sm font-semibold text-[#1f2937]">Total Purchased Electricity Activity</p>
                        <p className="mt-2 text-lg font-semibold text-[#1a1a1a]">9,346.9 kWh</p>
                      </div>
                      
                      <div className="rounded-lg border border-[#dfe8e5] bg-[#fdfdfd] px-5 py-4">
                        <p className="text-sm font-semibold text-[#1f2937]">Total Emission of Purchased Electricity</p>
                        <p className="mt-2 text-lg font-semibold text-[#1a1a1a]">3,757.4538 kg CO<sub>2</sub>e</p>
                      </div>
                    </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-3 mt-8">
                <button className="px-5 py-2 text-sm text-[#1a8f85] font-semibold border border-[#c8d9d6] rounded bg-white hover:bg-[#f5fbfa]">
                  Cancel
                </button>
                <button className="px-5 py-2 text-sm text-white font-semibold rounded bg-[#2aa39f] hover:bg-[#239089]">
                  Submit
                </button>
                <button className="px-5 py-2 text-sm text-white font-semibold rounded bg-[#1a8f85]">
                  Save
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
      {showDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e5e7eb] px-8 py-6">
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">Biodiesel blend b20 &gt; litre</h3>
              <button
                type="button"
                onClick={() => setShowDataModal(false)}
                className="rounded-md p-2 text-[#6b7280] hover:bg-[#f4f5f7]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-8 py-4">
              <div className="mb-3 grid grid-cols-[1fr_1.4fr_1.4fr_auto_auto_1.5fr] gap-4 rounded-xl bg-[#f6f8f7] px-5 py-3 text-sm font-semibold text-[#1a8f85]">
                <span>Month</span>
                <span>Value - litre</span>
                <span>Last Year (2024) - litre</span>
                <span className="text-center">Doc</span>
                <span className="text-center">OCR</span>
                <span>Remarks</span>
              </div>
              <div className="space-y-0 divide-y divide-[#f0f2f1] border border-[#f0f2f1] rounded-xl bg-white">
                {dataMonths.map((month) => (
                  <div
                    key={month}
                    className="grid grid-cols-[1fr_1.4fr_1.4fr_auto_auto_1.5fr] items-center gap-4 px-5 py-3"
                  >
                    <span className="text-sm font-medium text-[#1a1a1a]">{month}</span>
                    <input
                      type="text"
                      defaultValue={month === "Jul 2024" ? "68.07" : ""}
                      className="h-10 rounded-lg border border-[#dfe5e2] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none"
                    />
                    <input
                      type="text"
                      className="h-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-sm text-[#9ca3af] focus:outline-none"
                    />
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#cfe2dc] bg-white text-[#1a8f85]"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    {(() => {
                      const isOcrEnabled = month === "Jul 2024"
                      return (
                        <button
                          type="button"
                          disabled={!isOcrEnabled}
                          onClick={() => isOcrEnabled && openOcrPreview(month, "scope1")}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                            isOcrEnabled
                              ? "border-[#cfe2dc] bg-white text-[#1a8f85]"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <ScanText className="h-4 w-4" />
                        </button>
                      )
                    })()}
                    <input
                      type="text"
                      className="h-10 rounded-lg border border-[#dfe5e2] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-8 py-5">
              <div className="flex items-center gap-4 text-sm text-[#1a1a1a]">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1a8f85] px-4 py-2 text-sm font-semibold text-[#1a8f85]"
                >
                  Calculate
                </button>
                <div>
                  <span className="font-semibold">Total:</span> 68.07 litre
                </div>
                <div>
                  <span className="font-semibold">Emission:</span> 146.71586 kg CO<sub>2</sub>e
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-lg bg-[#1a8f85] px-5 py-2 text-sm font-semibold text-white">
                  Calculate and Save
                </button>
                <button
                  className="rounded-lg border border-[#c8d9d6] px-5 py-2 text-sm font-semibold text-[#1a8f85]"
                  onClick={() => setShowDataModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showScopeTwoDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e5e7eb] px-8 py-6">
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">Purchased Electricity &gt; Location-based</h3>
              <button
                type="button"
                onClick={() => setShowScopeTwoDataModal(false)}
                className="rounded-md p-2 text-[#6b7280] hover:bg-[#f4f5f7]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-8 py-4">
              <div className="mb-3 grid grid-cols-[1fr_1.4fr_1.4fr_auto_auto_1.5fr] gap-4 rounded-xl bg-[#f6f8f7] px-5 py-3 text-sm font-semibold text-[#1a8f85]">
                <span>Month</span>
                <span>Value - kWh</span>
                <span>Last Year (2024) - kWh</span>
                <span className="text-center">Doc</span>
                <span className="text-center">OCR</span>
                <span>Remarks</span>
              </div>
              <div className="space-y-0 divide-y divide-[#f0f2f1] border border-[#f0f2f1] rounded-xl bg-white">
                {dataMonths.map((month) => {
                  const isJan = month === "Jan 2025"
                  const isOcrEnabled = isJan
                  return (
                    <div
                      key={`scope2-${month}`}
                      className="grid grid-cols-[1fr_1.4fr_1.4fr_auto_auto_1.5fr] items-center gap-4 px-5 py-3"
                    >
                      <span className="text-sm font-medium text-[#1a1a1a]">{month}</span>
                      <input
                        type="text"
                        defaultValue={isJan ? "9,346.9" : ""}
                        className="h-10 rounded-lg border border-[#dfe5e2] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none"
                      />
                      <input
                        type="text"
                        className="h-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-sm text-[#9ca3af] focus:outline-none"
                      />
                      {isJan ? (
                        <button
                          type="button"
                          className="flex items-center  rounded-xl border border-[#cfe2dc] bg-white px-3 py-1.5 text-sm font-md text-[#1a8f85]"
                        >
                          <FileText className="h-4 w-4" />
                          (1)
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#cfe2dc] bg-white text-[#1a8f85]"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={!isOcrEnabled}
                        onClick={() => isOcrEnabled && openOcrPreview(month, "scope2")}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          isOcrEnabled
                            ? "border-[#cfe2dc] bg-white text-[#1a8f85]"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <ScanText className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        className="h-10 rounded-lg border border-[#dfe5e2] bg-white px-3 text-sm text-[#1a1a1a] focus:outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-8 py-5">
              <div className="flex items-center gap-4 text-sm text-[#1a1a1a]">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1a8f85] px-4 py-2 text-sm font-semibold text-[#1a8f85]"
                >
                  Calculate
                </button>
                <div>
                  <span className="font-semibold">Total:</span> 9,346.9 kWh
                </div>
                <div>
                  <span className="font-semibold">Emission:</span> 3,757.4538 kg CO<sub>2</sub>e
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-lg bg-[#1a8f85] px-5 py-2 text-sm font-semibold text-white">
                  Calculate and Save
                </button>
                <button
                  className="rounded-lg border border-[#c8d9d6] px-5 py-2 text-sm font-semibold text-[#1a8f85]"
                  onClick={() => setShowScopeTwoDataModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e5e7eb] px-6 py-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1a1a1a]">OCR Preview</h3>
                {ocrMonth && <p className="text-sm text-gray-500 mt-1">For {ocrMonth}</p>}
              </div>
              <button
                type="button"
                onClick={closeOcrModal}
                className="rounded-md p-2 text-[#6b7280] hover:bg-[#f4f5f7]"
                aria-label="Close OCR preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm text-gray-800">
              {ocrLoading && <p className="text-[#1a8f85]">Loading OCR preview...</p>}
              {ocrError && <p className="text-red-500">Error: {ocrError}</p>}
              {!ocrLoading && !ocrError && (
                <>
                  {ocrImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={ocrImageUrl}
                          alt={`OCR preview ${ocrMonth ?? ""}`}
                          className="w-full rounded-lg border border-gray-200"
                          onLoad={(event) =>
                            setImageRenderSize({
                              width: event.currentTarget.clientWidth,
                              height: event.currentTarget.clientHeight,
                            })
                          }
                        />
                        {ocrPageSize && imageRenderSize.width > 0 && imageRenderSize.height > 0 && (
                          <div className="pointer-events-none absolute inset-0">
                            {ocrHighlights
                              .filter((highlight) => highlight.pageIndex === 0)
                              .map((highlight) => {
                                const rect = highlight.rectangle
                                const scaleX = imageRenderSize.width / (ocrPageSize?.width ?? imageRenderSize.width)
                                const scaleY = imageRenderSize.height / (ocrPageSize?.height ?? imageRenderSize.height)
                                const left = rect.x0 * scaleX
                                const top = rect.y0 * scaleY
                                const width = (rect.x1 - rect.x0) * scaleX
                                const height = (rect.y1 - rect.y0) * scaleY
                                return (
                                  <div
                                    key={highlight.id}
                                    style={{
                                      left,
                                      top,
                                      width,
                                      height,
                                    }}
                                    className="absolute  border-1 border-[#1a8f85] bg-[#1a8f85]/15"
                                  >
                                    <span className="absolute -top-7 left-1 rounded bg-[#1a8f85] px-2 py-1.5 text-[12px] font-md text-white shadow-sm">
                                      {highlight.fieldKey}
                                    </span>
                                  </div>
                                )
                              })}
                          </div>
                        )}
                      </div>
                      {ocrPdfUrl && (
                        <a
                          href={ocrPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-[#1a8f85] underline"
                        >
                          Open original PDF
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Image preview unavailable.</p>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-end border-t border-[#e5e7eb] px-6 py-4">
              <button
                type="button"
                onClick={closeOcrModal}
                className="rounded-lg border border-[#c8d9d6] px-4 py-2 text-sm font-semibold text-[#1a8f85]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
