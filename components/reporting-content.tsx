
"use client"

import { useState } from "react"
import {
  Bell,
  Globe,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  ChevronsUpDown,
  Calendar,
  HelpCircle,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment-modal"
import Image from "next/image"
import { useRouter } from "next/navigation"

const assessments = [
  {
    id: 1,
    name: "ESGReport 2025",
    lastUpdated: "10-Dec-2025",
    icon: "/ESGReport.svg",
  },
  {
    id: 2,
    name: "ESGReport 2024",
    lastUpdated: "02-Dec-2025",
    icon: "/ESGReport.svg",
  },
  {
    id: 3,
    name: "GCNS 2025",
    lastUpdated: "13-Jun-2025",
    icon: "/GCNS.svg",
  },
  {
    id: 4,
    name: "34",
    lastUpdated: "02-Jun-2025",
    icon: "cpq_logo.png",
  },
  {
    id: 5,
    name: "XYZ",
    lastUpdated: "13-May-2025",
    icon: "cpq_logo.png",
  },
  {
    id: 6,
    name: "ESBN 2023",
    lastUpdated: "30-May-2025",
    icon: "esbn_logo.png",
  },
  {
    id: 7,
    name: "GCNS 2024",
    lastUpdated: "18-Mar-2025",
    icon: "/GCNS.svg",
  },
  {
    id: 8,
    name: "ESG Starter 2023",
    lastUpdated: "30-May-2025",
    icon: "esbn_logo.png",
  },
]

const historyRows = [
  {
    id: 1,
    reportType: "ESGReport",
    name: "ESGReport 2025",
    yearEnded: "Dec 2025",
    progress: "Completed",
    verificationStatus: "-",
    submissionDate: "07-Jan-2025",
    lastModifiedDate: "11-Dec-2025",
  },
  {
    id: 2,
    reportType: "ESGReport",
    name: "ESGReport 2024",
    yearEnded: "Dec 2024",
    progress: "Completed",
    verificationStatus: "-",
    submissionDate: "07-Jan-2026",
    lastModifiedDate: "07-Jan-2026",
  },
]

export function ReportingContent() {
  const [activeTab, setActiveTab] = useState<"all" | "ongoing" | "history">("ongoing")
  const [openActionId, setOpenActionId] = useState<number | null>(null)
  const [showHistoryView, setShowHistoryView] = useState(false)
  const [historyViewRow, setHistoryViewRow] = useState<(typeof historyRows)[number] | null>(null)
  const [isHistoryScopeOneOpen, setIsHistoryScopeOneOpen] = useState(false)
  const [isHistoryScopeTwoOpen, setIsHistoryScopeTwoOpen] = useState(false)
  const [isHistoryMobileAssetOpen, setIsHistoryMobileAssetOpen] = useState(false)
  const [isHistoryPurchasedElectricityOpen, setIsHistoryPurchasedElectricityOpen] = useState(false)
  const [isHistoryNonMobileAssetOpen, setIsHistoryNonMobileAssetOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSource, setPaymentSource] = useState<"electricity" | "mobile" | "stationary">("electricity")
  const router = useRouter()

  const handleContinue = (assessment: (typeof assessments)[number]) => {
    if (assessment.name === "ESGReport 2025") {
      router.push("/reporting/form?form=ESGReport&id=6928fceb71284eb89ee5257e")
      return
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Reporting</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-[#2AA39F]" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-lg border-[#2AA39F] text-[#2AA39F] bg-transparent"
          >
            English
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-lg border-[#2AA39F] text-[#2AA39F] bg-transparent"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-8 py-6">
        {/* Title and Tabs Row */}
        {!showHistoryView && (
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "history" ? "Explore past reports and completed assessments" : "Manage your ongoing assessments"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "history"
                  ? "Review your completed assessments and track your milestones. Reflect on your progress and achievements over time."
                  : "Continue tracking your progress with assessments currently in progress."}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded ${activeTab === "all" ? "font-semibold text-gray-900" : "text-gray-500"}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`px-3 py-1 rounded ${activeTab === "ongoing" ? "font-semibold text-gray-900" : "text-gray-500"}`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3 py-1 rounded ${activeTab === "history" ? "font-semibold text-gray-900" : "text-gray-500"}`}
              >
                History
              </button>
            </div>
          </div>
        )}

        {activeTab === "history" ? (
          showHistoryView ? (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center gap-2 text-sm text-[#2AA39F] font-medium hover:underline"
                    onClick={() => {
                      setShowHistoryView(false)
                      setHistoryViewRow(null)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <span className="text-sm font-semibold text-[#2AA39F]">Edit Asset</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2AA39F] text-[#2AA39F] text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Reporting Year: {historyViewRow?.yearEnded.split(" ")[1] ?? "2024"}
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2AA39F] text-[#2AA39F] text-sm font-medium">
                    Actions
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-6 px-6 py-6 bg-[#fbfbfb]">
                <aside className="w-72 shrink-0 border border-gray-100 rounded-xl bg-white">
                  <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100 text-[#2AA39F] font-semibold">
                    <Lock className="h-4 w-4" />
                    Asset Characte...
                    <ChevronDown className="h-4 w-4 ml-auto text-[#2AA39F]" />
                  </div>
                  <div className="px-4 py-3 border-b border-gray-100 text-[#2AA39F] font-semibold flex items-center justify-between">
                    ASSET TOTAL
                    <ChevronDown className="h-4 w-4 text-[#2AA39F]" />
                  </div>
                  <div className="px-4 py-3 border-b border-gray-100 text-[#2AA39F] font-semibold flex items-center justify-between">
                    Asset 1: SOP GREEN...
                    <ChevronDown className="h-4 w-4 text-[#2AA39F]" />
                  </div>
                  <div className="px-4 py-3 border-b border-gray-100 text-[#2AA39F] font-semibold flex items-center justify-between">
                    Asset 2: Malaysia ...
                    <ChevronDown className="h-4 w-4 text-[#2AA39F]" />
                  </div>

                  <div className="px-4 pt-4 text-sm font-semibold text-gray-800">Environmental Impact</div>
                  <div className="px-4 py-2">
                    <div className="rounded-lg bg-[#EEF8F6] px-3 py-2 text-sm font-medium text-[#1A8F85]">
                      Emission and Climate Im...
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-700">Environmental Metrics</div>
                  </div>

                  <div className="px-4 pt-2 text-sm font-semibold text-gray-800">Social Impact</div>
                  <div className="px-4 pb-2">
                    <div className="px-3 py-2 text-sm text-gray-700">Our Employees</div>
                  </div>

                  <div className="px-4 pt-2 text-sm font-semibold text-gray-800">Ethics and Integrity</div>
                  <div className="px-4 pb-2">
                    <div className="px-3 py-2 text-sm text-gray-700">Sustainable Governance</div>
                  </div>

                  <div className="px-4 pt-2 text-sm font-semibold text-gray-800">Supplementary Disclos...</div>
                </aside>

                <section className="flex-1 space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-700">
                      Please select whether you will be attaching monthly or yearly data in the assessment
                    </p>
                    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                      <button className="px-5 py-2 text-sm font-medium text-gray-600 bg-[#E5E7EB]">monthly</button>
                      <button className="px-5 py-2 text-sm font-medium text-gray-600 bg-white">yearly</button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white">
                    <button
                      className="w-full flex items-center justify-between px-4 py-4 text-left text-base font-semibold text-gray-900"
                      onClick={() => setIsHistoryScopeOneOpen((prev) => !prev)}
                    >
                      <span className="inline-flex items-center gap-2">
                        Scope 1: Direct Emissions
                        <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-500 ${isHistoryScopeOneOpen ? "" : "-rotate-90"}`} />
                    </button>
                    {isHistoryScopeOneOpen && (
                      <div className="border-t border-gray-200 px-4 py-4">
                        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                          <div className="border-b border-gray-200">
                            <button
                              className="w-full flex items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900"
                              onClick={() => setIsHistoryMobileAssetOpen((prev) => !prev)}
                            >
                              <span className="inline-flex items-center gap-2">
                                Mobile Asset Combustion
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 ${isHistoryMobileAssetOpen ? "" : "-rotate-90"}`}
                              />
                            </button>
                            {isHistoryMobileAssetOpen && (
                              <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <p className="text-sm text-gray-800">
                                    Does this asset use and/or leases vehicles? (Note: Vehicles can include cars, trucks,
                                    propane forklifts, aircrafts or boats)
                                  </p>
                                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-700">
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-mobile-vehicle" defaultChecked />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-mobile-vehicle" />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <div className="grid gap-4 lg:grid-cols-3">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">EF Source</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        DEFRA (UK)
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Calculate By</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        Fuel Consumption
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Fuel Type</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        Natural gas (100% mineral blend) / kWh (Gros...
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-4 lg:grid-cols-[120px_1fr_1fr]">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Value</label>
                                      <button className="w-full rounded-lg border border-[#2AA39F] px-4 py-2 text-sm font-semibold text-[#2AA39F]">
                                        Data
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Total</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">242,136</span>
                                        <span className="border-l border-gray-200 px-4 py-2">kWh (Gross CV)</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Calculated Emission</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">44,671.67064</span>
                                        <span className="border-l border-gray-200 px-4 py-2">kg CO₂e</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>Total activity of mobile asset combustion (kWh (Gross cv))</span>
                                  <span className="text-gray-700">242,136 kWh (Gross Cv)</span>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>Total emission of mobile asset combustion</span>
                                  <span className="text-gray-700">44,671.67064 kg CO₂e</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPaymentSource("mobile")
                                    setShowPaymentModal(true)
                                  }}
                                  className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-semibold text-gray-900"
                                >
                                  <div className="relative flex items-center justify-between">
                                    <span>Decarbonization strategies</span>
                                    <Lock className="h-4 w-4 text-gray-500" />
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="border-b border-gray-200">
                            <button
                              className="w-full flex items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900"
                              onClick={() => setIsHistoryNonMobileAssetOpen((prev) => !prev)}
                            >
                              <span className="inline-flex items-center gap-2">
                                Non-Mobile / Stationary Asset Combustion
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 ${isHistoryNonMobileAssetOpen ? "" : "-rotate-90"}`}
                              />
                            </button>
                            {isHistoryNonMobileAssetOpen && (
                              <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <p className="text-sm text-gray-800">
                                    Does this asset burn fuel(s) on-site? (Note: Fuels can include natural gas, propane,
                                    coal, fuel oil for heating, diesel fuel for backup generators, biomass fuels)
                                  </p>
                                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-700">
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-nonmobile-fuel" defaultChecked />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-nonmobile-fuel" />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">EF Source</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        US EPA
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Fuel Type</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        Agricultural byproduct / mmBtu (Gross CV)
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-4 lg:grid-cols-[120px_1fr_1fr_1fr]">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Value</label>
                                      <button className="w-full rounded-lg border border-[#2AA39F] px-4 py-2 text-sm font-semibold text-[#2AA39F]">
                                        Data
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Total</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">53,452</span>
                                        <span className="border-l border-gray-200 px-4 py-2">mmBtu (Gross CV)</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Total Activity (kWh)</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">-</span>
                                        <span className="border-l border-gray-200 px-4 py-2">
                                          <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Calculated Emission</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">6,423,893.4312</span>
                                        <span className="border-l border-gray-200 px-4 py-2">kg CO₂e</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>Total emission of non-mobile asset combustion</span>
                                  <span className="text-gray-700">6,423,893.4312 kg CO₂e</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPaymentSource("stationary")
                                    setShowPaymentModal(true)
                                  }}
                                  className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-semibold text-gray-900"
                                >
                                  <div className="relative flex items-center justify-between">
                                    <span>Decarbonization strategies</span>
                                    <Lock className="h-4 w-4 text-gray-500" />
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                          {[
                            "Fugitive Emission",
                            "Industrial Processes",
                            "Land use, land use change and forestry (LULUCF)",
                            "Scope 1 Emissions Summary",
                            "Supplementary Disclosure",
                          ].map((item, index) => (
                            <button
                              key={item}
                              className={`w-full flex items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900 ${
                                index === 0 ? "" : "border-t border-gray-200"
                              }`}
                            >
                              <span className="inline-flex items-center gap-2">
                                {item}
                                {index < 3 && (
                                  <>
                                    <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                    <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                  </>
                                )}
                              </span>
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white">
                    <button
                      className="w-full flex items-center justify-between px-4 py-4 text-left text-base font-semibold text-gray-900"
                      onClick={() => setIsHistoryScopeTwoOpen((prev) => !prev)}
                    >
                      <span className="inline-flex items-center gap-2">
                        Scope 2: Indirect Emissions
                        <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                      </span>
                      <ChevronDown className={`h-5 w-5 text-gray-500 ${isHistoryScopeTwoOpen ? "" : "-rotate-90"}`} />
                    </button>
                    {isHistoryScopeTwoOpen && (
                      <div className="border-t border-gray-200 px-4 py-4">
                        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                          <div className="border-b border-gray-200">
                            <button
                              className="w-full flex items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900"
                              onClick={() => setIsHistoryPurchasedElectricityOpen((prev) => !prev)}
                            >
                              <span className="inline-flex items-center gap-2">
                                Purchased Electricity
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 ${isHistoryPurchasedElectricityOpen ? "" : "-rotate-90"}`}
                              />
                            </button>
                            {isHistoryPurchasedElectricityOpen && (
                              <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <p className="text-sm text-gray-800">Does this asset use purchased electricity?</p>
                                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-700">
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-purchased-electricity" defaultChecked />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="history-purchased-electricity" />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div className="text-sm font-semibold text-gray-900">Location-based</div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Purpose</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        Electric Consumption
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Grid Region</label>
                                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm text-gray-600">
                                        Afghanistan (IFI TWG)
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-4 lg:grid-cols-[120px_1fr_1fr]">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Value</label>
                                      <button className="w-full rounded-lg border border-[#2AA39F] px-4 py-2 text-sm font-semibold text-[#2AA39F]">
                                        Data
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Total</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">20,641.8</span>
                                        <span className="border-l border-gray-200 px-4 py-2">kWh</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Calculated Emission</label>
                                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f7] text-sm text-gray-600">
                                        <span className="flex-1 px-4 py-2">8,543.5034</span>
                                        <span className="border-l border-gray-200 px-4 py-2">kg CO₂e</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>Total Purchased Electricity Activity</span>
                                  <span className="text-gray-700">20,641.8 kWh</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPaymentSource("electricity")
                                    setShowPaymentModal(true)
                                  }}
                                  className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-semibold text-gray-900"
                                >
                                  <div className="relative flex items-center justify-between">
                                    <span>Decarbonization strategies</span>
                                    <Lock className="h-4 w-4 text-gray-500" />
                                  </div>
                                </button>
                              </div>
                            )}
                          </div>
                          {[
                            "Purchased Steam",
                            "Purchased Heating",
                            "Purchased Cooling",
                            "Scope 2 Emissions Summary",
                            "Supplementary Disclosure",
                          ].map((item, index) => (
                            <button
                              key={item}
                              className={`w-full flex items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900 ${
                                index === 0 ? "" : "border-t border-gray-200"
                              }`}
                            >
                              <span className="inline-flex items-center gap-2">
                                {item}
                                {index === 0 && (
                                  <>
                                    <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                    <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                                  </>
                                )}
                              </span>
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left text-base font-semibold text-gray-900">
                    <span className="inline-flex items-center gap-2">
                      Scope 3: Other Indirect Emissions
                      <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left text-base font-semibold text-gray-900">
                    <span>Scope 3: Tenant Emissions</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left text-base font-semibold text-gray-900">
                    <span className="inline-flex items-center gap-2">
                      Biogenic Emissions and Removal
                      <HelpCircle className="h-4 w-4 text-[#2AA39F]" />
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left text-base font-semibold text-gray-900">
                    <span>Emission Result</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-lg bg-[#2AA39F] text-white text-sm font-medium">
                    Filter By Report Type
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-[#2AA39F] text-[#2AA39F] text-sm font-medium">
                    Filter By Progress
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-[#2AA39F] text-[#2AA39F] text-sm font-medium">
                    Filter By Verification status
                  </button>
                </div>
                <button className="text-sm text-[#2AA39F]">Reset</button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-visible bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white border-b border-gray-200 text-gray-700">
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">Report Type</th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">Name</th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">For the Year ended</th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">Progress</th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">Verification status</th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">
                        <span className="inline-flex items-center gap-1">
                          Submission Date
                          <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                        </span>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">
                        <span className="inline-flex items-center gap-1">
                          Last Modified Date
                          <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                        </span>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold border-r border-gray-100">Visibility</th>
                      <th className="text-left px-4 py-3 font-semibold">Action(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-4 py-3 text-gray-800">{row.reportType}</td>
                        <td className="px-4 py-3 text-gray-800">{row.name}</td>
                        <td className="px-4 py-3 text-gray-800">{row.yearEnded}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${
                              row.progress === "Completed"
                                ? "text-[#47A025] border-[#BFE7A9] bg-[#F2FBED]"
                                : "text-[#2A6FF0] border-[#BFD4FF] bg-[#EEF4FF]"
                            }`}
                          >
                            {row.progress}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-800">{row.verificationStatus}</td>
                        <td className="px-4 py-3 text-gray-800">{row.submissionDate}</td>
                        <td className="px-4 py-3 text-gray-800">{row.lastModifiedDate}</td>
                        <td className="px-4 py-3 text-gray-800">
                          <Eye className="h-5 w-5 text-gray-700" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative inline-block text-left">
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-[#5BB5A7] text-white rounded-lg text-sm hover:bg-[#4DAA9B]"
                              onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                            >
                              Action(s)
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            {openActionId === row.id ? (
                              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg z-50">
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                                  onClick={() => {
                                    setOpenActionId(null)
                                    setHistoryViewRow(row)
                                    setShowHistoryView(true)
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-xl"
                                  onClick={() => setOpenActionId(null)}
                                >
                                  Get Verification
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                  <span className="text-sm text-gray-600">1 - 2 of 2 results</span>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="w-7 h-7 flex items-center justify-center border border-[#2AA39F] text-[#2AA39F] rounded-md text-sm">
                      1
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1 ml-2 px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-600">
                      10 / page
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Assessment Cards Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image
                        src={assessment.icon || "/placeholder.svg"}
                        alt={assessment.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{assessment.name}</h3>
                      <p className="text-sm text-gray-500">Last updated on {assessment.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-[#5BB5A7] hover:bg-[#4DAA9B] text-white rounded-md px-5 shadow-sm"
                      onClick={() => handleContinue(assessment)}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-[#2AA39F] text-[#2AA39F] rounded-lg hover:bg-[#2AA39F]/10 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border-[#2AA39F] text-[#2AA39F] bg-transparent"
              >
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </>
        )}
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        redirectTo={`/decarbonization-strategies?source=${paymentSource}`}
      />
    </div>
  )
}
