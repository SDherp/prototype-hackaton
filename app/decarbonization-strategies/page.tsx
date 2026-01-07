"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

type SourceKey = "electricity" | "mobile" | "stationary"

const baselineBySource: Record<SourceKey, Array<{ metric: string; value: string }>> = {
  electricity: [
    { metric: "Annual electricity use", value: "~20,641.8 MWh" },
    { metric: "Electricity emissions", value: "~500 tCO₂e/year" },
    { metric: "Grid emission factor", value: "~0.42 kgCO₂e/kWh" },
  ],
  mobile: [
    { metric: "Fuel consumption (diesel/petrol)", value: "Typical fleet benchmark" },
    { metric: "Emissions scope", value: "Scope 1 – mobile combustion" },
    { metric: "Emission factors", value: "Region-appropriate fuel factors" },
  ],
  stationary: [
    { metric: "Fuel use (gas/diesel/LPG)", value: "Typical boiler / generator benchmark" },
    { metric: "Emissions scope", value: "Scope 1 – stationary combustion" },
    { metric: "Emission factors", value: "Fuel-specific combustion factors" },
  ],
}

const sourceLabels: Record<SourceKey, string> = {
  electricity: "Electricity",
  mobile: "Mobile Combustion",
  stationary: "Stationary Combustion",
}

const scenarioDetails: Record<
  SourceKey,
  Record<
    "10%" | "20%" | "30%",
    {
      title: string
      totalImpact: string
      rows: Array<{
        opportunity: string
        instruction: string
        reduction: string
        cost: string
        savings: string
        payback: string
      }>
    }
  >
> = {
  electricity: {
    "10%": {
      title: "Operational and behavioural improvements",
      totalImpact: "~10% electricity emissions reduction.",
      rows: [
        {
          opportunity: "LED lighting retrofit",
          instruction: "Replace 70%–90% of lighting with LEDs, targeting 40%–60% lighting energy reduction.",
          reduction: "30–42 tCO₂e/yr",
          cost: "USD 30k–90k",
          savings: "USD 8k–25k",
          payback: "2–6 yrs",
        },
        {
          opportunity: "Night-time shutdown",
          instruction: "Shut down non-critical loads 8–10 hrs/night, 36–48 hrs/weekend.",
          reduction: "8–20 tCO₂e/yr",
          cost: "USD 1k–10k",
          savings: "USD 2k–12k",
          payback: "<1–1.5 yrs",
        },
      ],
    },
    "20%": {
      title: "Efficiency plus structural changes",
      totalImpact: "~20% electricity emissions reduction.",
      rows: [
        {
          opportunity: "Onsite solar PV",
          instruction: "Deploy onsite solar PV capacity to offset grid electricity use.",
          reduction: "—",
          cost: "—",
          savings: "—",
          payback: "—",
        },
        {
          opportunity: "HVAC optimisation",
          instruction: "Same as previously defined.",
          reduction: "—",
          cost: "—",
          savings: "—",
          payback: "—",
        },
      ],
    },
    "30%": {
      title: "Structural and market-based measures",
      totalImpact: "~30% electricity emissions reduction.",
      rows: [
        {
          opportunity: "Expanded solar PV",
          instruction: "Scale onsite solar PV deployment to increase renewable coverage.",
          reduction: "—",
          cost: "—",
          savings: "—",
          payback: "—",
        },
        {
          opportunity: "Renewable electricity procurement",
          instruction: "Same as previously defined.",
          reduction: "—",
          cost: "—",
          savings: "—",
          payback: "—",
        },
      ],
    },
  },
  mobile: {
    "10%": {
      title: "Operational and behavioural improvements",
      totalImpact: "~10% mobile combustion emissions reduction.",
      rows: [
        {
          opportunity: "Driver behaviour programme",
          instruction: "Implement eco-driving guidance and monitoring to reduce fuel use by 5%–7% across fleet.",
          reduction: "5–8 tCO₂e/yr",
          cost: "USD 2k–10k",
          savings: "USD 4k–12k",
          payback: "<1–2 yrs",
        },
        {
          opportunity: "Idle time reduction",
          instruction: "Enforce idle limits and engine-off policies targeting 3%–5% fuel reduction.",
          reduction: "3–6 tCO₂e/yr",
          cost: "Minimal",
          savings: "USD 3k–8k",
          payback: "<1 yr",
        },
      ],
    },
    "20%": {
      title: "Efficiency plus structural changes",
      totalImpact: "~20% mobile combustion emissions reduction.",
      rows: [
        {
          opportunity: "Partial fleet electrification",
          instruction: "Replace 10%–15% of light-duty vehicles with EVs.",
          reduction: "12–18 tCO₂e/yr",
          cost: "USD 150k–300k",
          savings: "USD 15k–30k",
          payback: "5–8 yrs",
        },
        {
          opportunity: "Route & utilisation optimisation",
          instruction: "Use routing and scheduling tools to reduce distance travelled by 5%–7%.",
          reduction: "6–10 tCO₂e/yr",
          cost: "USD 5k–20k",
          savings: "USD 8k–20k",
          payback: "1–3 yrs",
        },
      ],
    },
    "30%": {
      title: "Structural and market-based measures",
      totalImpact: "~30% mobile combustion emissions reduction.",
      rows: [
        {
          opportunity: "Accelerated electrification",
          instruction: "Electrify 25%–30% of fleet vehicles.",
          reduction: "25–35 tCO₂e/yr",
          cost: "USD 350k–700k",
          savings: "USD 30k–70k",
          payback: "6–10 yrs",
        },
        {
          opportunity: "Low-carbon fuel sourcing",
          instruction: "Use biofuels or low-carbon fuel blends for 10%–15% of remaining fleet fuel.",
          reduction: "10–15 tCO₂e/yr",
          cost: "USD 0–20k/yr",
          savings: "Neutral to negative",
          payback: "N/A",
        },
      ],
    },
  },
  stationary: {
    "10%": {
      title: "Operational and behavioural improvements",
      totalImpact: "~10% stationary combustion emissions reduction.",
      rows: [
        {
          opportunity: "Boiler tuning & maintenance",
          instruction: "Optimise combustion efficiency and controls to reduce fuel use by 5%–7%.",
          reduction: "6–9 tCO₂e/yr",
          cost: "USD 3k–15k",
          savings: "USD 4k–10k",
          payback: "<1–2 yrs",
        },
        {
          opportunity: "Operating schedule optimisation",
          instruction: "Reduce unnecessary runtime during low-demand periods, targeting 3%–5% fuel reduction.",
          reduction: "4–6 tCO₂e/yr",
          cost: "USD 1k–8k",
          savings: "USD 3k–7k",
          payback: "<1 yr",
        },
      ],
    },
    "20%": {
      title: "Efficiency plus structural changes",
      totalImpact: "~20% stationary combustion emissions reduction.",
      rows: [
        {
          opportunity: "High-efficiency burner upgrade",
          instruction: "Upgrade burners or controls to improve efficiency by 10%–12%.",
          reduction: "12–16 tCO₂e/yr",
          cost: "USD 40k–120k",
          savings: "USD 12k–25k",
          payback: "3–6 yrs",
        },
        {
          opportunity: "Heat recovery",
          instruction: "Install basic heat recovery to offset 5%–8% of fuel use.",
          reduction: "6–10 tCO₂e/yr",
          cost: "USD 25k–80k",
          savings: "USD 8k–20k",
          payback: "3–7 yrs",
        },
      ],
    },
    "30%": {
      title: "Structural and market-based measures",
      totalImpact: "~30% stationary combustion emissions reduction.",
      rows: [
        {
          opportunity: "Fuel switching",
          instruction: "Switch 15%–20% of fuel demand to lower-carbon alternatives where available.",
          reduction: "18–25 tCO₂e/yr",
          cost: "USD 80k–200k",
          savings: "Variable",
          payback: "5–10 yrs",
        },
        {
          opportunity: "Renewable thermal procurement",
          instruction: "Procure renewable gas or thermal certificates covering 10% of fuel use.",
          reduction: "10–15 tCO₂e/yr",
          cost: "USD 0–25k/yr",
          savings: "Neutral to negative",
          payback: "N/A",
        },
      ],
    },
  },
}

export default function DecarbonizationStrategiesPage() {
  const searchParams = useSearchParams()
  const sourceParam = (searchParams.get("source") || "electricity").toLowerCase()
  const sourceKey: SourceKey =
    sourceParam === "mobile" || sourceParam === "mobile_combustion"
      ? "mobile"
      : sourceParam === "stationary" || sourceParam === "stationary_combustion"
        ? "stationary"
        : "electricity"
  const baselineRows = useMemo(() => baselineBySource[sourceKey], [sourceKey])
  const [activeScenario, setActiveScenario] = useState("Scenario A")
  const activeRate = activeScenario === "Scenario A" ? "10%" : activeScenario === "Scenario B" ? "20%" : "30%"
  const activeDetails = scenarioDetails[sourceKey][activeRate]

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900">Reporting</h1>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-[#2AA39F] px-4 py-2 text-sm text-[#2AA39F]">English</div>
            <div className="rounded-lg border border-[#2AA39F] px-4 py-2 text-sm text-[#2AA39F]">Settings</div>
          </div>
        </header>

        <main className="px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <Link href="/reporting" className="inline-flex items-center gap-2 text-sm text-[#2AA39F]">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">Decarbonization Strategies</h2>
              <p className="text-sm text-gray-600">
                Scenario-Based Emissions Reduction Pathways · {sourceLabels[sourceKey]}
              </p>
            </div>
            <div className="rounded-full border border-[#2AA39F] bg-white px-4 py-2 text-sm text-[#2AA39F]">
              Methodology: Activity-Based Energy Reduction Model
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,0.7fr)]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Methodology Overview</h3>
              <p className="mt-2 text-sm text-gray-600">
                This page uses an Activity-Based Energy Reduction Model to estimate potential emissions reductions.
              </p>
              <div className="mt-4 rounded-xl border border-gray-100 bg-[#f8fbfb] px-4 py-3 text-sm text-gray-700">
                Activity change → Energy or fuel impact → Emissions impact
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                  <h4 className="text-sm font-semibold text-gray-900">Model characteristics</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>Based on sector, region, and facility size benchmarks</li>
                    <li>Uses planning-grade assumptions</li>
                    <li>Produces indicative ranges, not guaranteed outcomes</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                  <h4 className="text-sm font-semibold text-gray-900">Model exclusions</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>Site-specific engineering design</li>
                    <li>Asset-level optimisation or retrofits</li>
                    <li>Financing, subsidies, or tax incentives</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Baseline Snapshot</h3>
              <p className="mt-2 text-sm text-gray-600">Dynamic by source: {sourceLabels[sourceKey]}</p>
              <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
                {baselineRows.map((row) => (
                  <div key={row.metric} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-gray-700">{row.metric}</span>
                    <span className="font-medium text-gray-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Scenario-Based Emissions Reduction Pathways</h3>
              <span className="text-sm text-[#2AA39F]">10% · 20% · 30% scenarios</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                { label: "Scenario A", rate: "10%" },
                { label: "Scenario B", rate: "20%" },
                { label: "Scenario C", rate: "30%" },
              ].map((scenario) => {
                const isActive = activeScenario === scenario.label
                return (
                  <button
                    key={scenario.label}
                    type="button"
                    onClick={() => setActiveScenario(scenario.label)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isActive ? "border-[#2AA39F] bg-[#e9f7f5]" : "border-gray-100 bg-[#f8fbfb] hover:border-[#9fdad4]"
                    }`}
                  >
                    <div className="text-sm text-gray-500">{scenario.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">{scenario.rate}</div>
                    <p className="mt-2 text-xs text-gray-600">
                      Applies the same modelling approach with adjusted baseline metrics, abatement levers, and
                      quantification units.
                    </p>
                  </button>
                )
              })}
            </div>
            <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {activeRate} Reduction Pathway
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">{activeDetails.title}</p>
                </div>
                <span className="text-sm text-[#2AA39F]">{activeDetails.totalImpact}</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-[#f8fbfb] text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Opportunity</th>
                      <th className="px-4 py-3 text-left font-semibold">Specific Instruction</th>
                      <th className="px-4 py-3 text-left font-semibold">Estimated Emissions Reduction</th>
                      <th className="px-4 py-3 text-left font-semibold">Indicative Cost</th>
                      <th className="px-4 py-3 text-left font-semibold">Estimated Annual Savings</th>
                      <th className="px-4 py-3 text-left font-semibold">Simple Payback</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {activeDetails.rows.map((row) => (
                      <tr key={row.opportunity} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <Link
                            href={`/partner-marketplace/${sourceKey}`}
                            className="text-left font-semibold text-[#2AA39F] hover:underline"
                          >
                            {row.opportunity}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{row.instruction}</td>
                        <td className="px-4 py-3">{row.reduction}</td>
                        <td className="px-4 py-3">{row.cost}</td>
                        <td className="px-4 py-3">{row.savings}</td>
                        <td className="px-4 py-3">{row.payback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
