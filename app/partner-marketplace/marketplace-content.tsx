import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export const emissionTypes = [
  {
    id: "mobile",
    name: "Mobile Asset Combustion",
    buttonLabel: "Mobile Asset Combustion",
    summary: "Fleet fuel use, on-road assets, and route-dependent emissions.",
    sections: [
      {
        id: "manufacturers",
        title: "Partner Manufacturers",
        purpose: "Equipment, technology, or products",
        items: [
          {
            name: "Voltera Fleet Systems",
            description: "End-to-end electric fleet platforms with depot planning support.",
            focus: "EV fleet leasing and charging depots",
            link: "https://example.com/voltera",
          },
          {
            name: "EcoTorque Engines",
            description: "Next-gen diesel and hybrid powertrains for heavy duty fleets.",
            focus: "Fuel-efficient engines and retrofit kits",
            link: "https://example.com/ecotorque",
            tag: "Fuel efficiency",
          },
          {
            name: "RoadPulse Telematics",
            description: "Real-time driver and route analytics for fuel reduction.",
            focus: "Telematics and driver behavior insights",
            link: "https://example.com/roadpulse",
          },
        ],
      },
      {
        id: "consultants",
        title: "Partner Management Consultants",
        purpose: "Advisory, decarbonization planning",
        items: [
          {
            name: "FleetShift Advisory",
            focus: "Fleet utilization, right-sizing, and transition modeling",
            engagement: "6-12 week fleet optimization roadmap",
            link: "https://example.com/fleetshift",
          },
          {
            name: "CarbonRoute Partners",
            focus: "Fuel transition strategy and infrastructure readiness",
            engagement: "Quarterly program management retainer",
            link: "https://example.com/carbonroute",
          },
          {
            name: "MotiveX Decarb Lab",
            focus: "Total cost of ownership and charging roll-out planning",
            engagement: "Workshop + phased fleet conversion plan",
            link: "https://example.com/motivex",
          },
        ],
      },
      {
        id: "contractors",
        title: "Partner Contractors",
        purpose: "Implementation and on-ground execution",
        items: [
          {
            name: "ChargeGrid Installers",
            scope: "EV charging design, permitting, and build",
            geography: "North America",
            link: "https://example.com/chargegrid",
          },
          {
            name: "RetroMove Services",
            scope: "Fleet retrofitting and drivetrain upgrades",
            geography: "North America and EU",
            link: "https://example.com/retromove",
          },
          {
            name: "DepotWorks Electric",
            scope: "Depot power upgrades and load management",
            geography: "Global",
            link: "https://example.com/depotworks",
          },
        ],
      },
    ],
  },
  {
    id: "stationary",
    name: "Stationary Emissions",
    buttonLabel: "Stationary",
    summary: "Boilers, generators, and on-site thermal systems.",
    sections: [
      {
        id: "manufacturers",
        title: "Partner Manufacturers",
        purpose: "Equipment, technology, or products",
        items: [
          {
            name: "ThermoFlux Boilers",
            description: "High-efficiency modular boilers for industrial heat loads.",
            focus: "Condensing boiler systems and controls",
            link: "https://example.com/thermoflux",
            tag: "Retrofit",
          },
          {
            name: "PrimeGen Microturbines",
            description: "Low-NOx generators optimized for flexible dispatch.",
            focus: "Hybrid generator packages",
            link: "https://example.com/primegen",
            tag: "Fuel efficiency",
          },
          {
            name: "CoolCore HVAC",
            description: "Smart HVAC efficiency tech with predictive maintenance.",
            focus: "HVAC optimization and monitoring",
            link: "https://example.com/coolcore",
            tag: "Efficiency",
          },
        ],
      },
      {
        id: "consultants",
        title: "Partner Management Consultants",
        purpose: "Advisory, strategy, measurement, decarbonization planning",
        items: [
          {
            name: "ThermalEdge Advisors",
            focus: "Energy audits and heat system benchmarking",
            engagement: "On-site audit plus action plan",
            link: "https://example.com/thermaledge",
          },
          {
            name: "ProcessSpark Consulting",
            focus: "Thermal optimization and controls strategy",
            engagement: "12-week optimization program",
            link: "https://example.com/processspark",
          },
          {
            name: "SiteLine Sustainability",
            focus: "Stationary emissions inventory and abatement planning",
            engagement: "Annual decarbonization roadmap",
            link: "https://example.com/siteline",
          },
        ],
      },
      {
        id: "contractors",
        title: "Partner Contractors",
        purpose: "Implementation and on-ground execution",
        items: [
          {
            name: "BoilerPro Upgrades",
            scope: "Boiler retrofits and burner tuning",
            geography: "North America",
            link: "https://example.com/boilerpro",
          },
          {
            name: "OnSite Energy Works",
            scope: "Generator replacements and controls installs",
            geography: "APAC",
            link: "https://example.com/onsite",
          },
          {
            name: "HVAC Retrofit Group",
            scope: "HVAC efficiency retrofits and commissioning",
            geography: "Global",
            link: "https://example.com/hvacretrofit",
          },
        ],
      },
    ],
  },
  {
    id: "electricity",
    name: "Electricity Emissions",
    buttonLabel: "Electricity",
    summary: "Purchased electricity and power sourcing decisions.",
    sections: [
      {
        id: "manufacturers",
        title: "Partner Manufacturers",
        purpose: "Equipment, technology, or products",
        items: [
          {
            name: "HelioStack Solar",
            description: "Commercial solar arrays with integrated monitoring.",
            focus: "Solar modules and inverters",
            link: "https://example.com/heliostack",
            tag: "Solar",
          },
          {
            name: "GridVault Storage",
            description: "Behind-the-meter storage for peak shaving and resilience.",
            focus: "Battery storage systems",
            link: "https://example.com/gridvault",
            tag: "Storage",
          },
          {
            name: "RenewCert Exchange",
            description: "Verified renewable energy certificate marketplace.",
            focus: "RECs procurement platform",
            link: "https://example.com/renewcert",
            tag: "Offsets",
          },
        ],
      },
      {
        id: "consultants",
        title: "Partner Management Consultants",
        purpose: "Advisory, strategy, measurement, decarbonization planning",
        items: [
          {
            name: "PowerSource Strategy",
            focus: "Power sourcing strategy and emissions modeling",
            engagement: "Executive sourcing advisory",
            link: "https://example.com/powersource",
          },
          {
            name: "PPA Compass",
            focus: "PPA negotiation and risk evaluation",
            engagement: "Deal structure and vendor selection",
            link: "https://example.com/ppacompass",
          },
          {
            name: "GridSense Analytics",
            focus: "Electricity emissions tracking and forecasting",
            engagement: "Monthly analytics subscription",
            link: "https://example.com/gridsense",
          },
        ],
      },
      {
        id: "contractors",
        title: "Partner Contractors",
        purpose: "Implementation and on-ground execution",
        items: [
          {
            name: "Sunforge Installations",
            scope: "Solar installation and commissioning",
            geography: "North America and EU",
            link: "https://example.com/sunforge",
          },
          {
            name: "Ampere Systems",
            scope: "Energy management systems and integration",
            geography: "Global",
            link: "https://example.com/ampere",
          },
          {
            name: "StorageWorks Field",
            scope: "Battery storage deployment and maintenance",
            geography: "APAC",
            link: "https://example.com/storageworks",
          },
        ],
      },
    ],
  },
] as const

export type EmissionTypeId = (typeof emissionTypes)[number]["id"]

type ContentProps = {
  activeTypeId: EmissionTypeId
}

export function PartnerMarketplaceContent({ activeTypeId }: ContentProps) {
  const activeType = emissionTypes.find((type) => type.id === activeTypeId) ?? emissionTypes[0]

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#f6f4ef]">
        <div className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#d9efe8] opacity-80 blur-3xl" />
            <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#f0d9c8] opacity-70 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#c7dbe8] opacity-60 blur-3xl" />
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-10">
            <header className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#476a66]">
                <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Affiliate Links</span>
                <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Partner Marketplace</span>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-semibold text-[#12201e] md:text-5xl">
                  Partner Marketplace for Emission Mitigation
                </h1>
                <p className="max-w-2xl text-base text-[#3e4b46] md:text-lg">
                  Discover vetted partners for equipment, advisory, and execution. Links are organized by
                  emission type so teams can move from measurement to action with confidence.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-[#1f2e2a]">Affiliate disclosure</span>
                  <p className="text-sm text-[#4f5b57]">
                    Some links are affiliate referrals. We only feature partners aligned with verified
                    decarbonization outcomes.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1f2e2a]">
                  <div className="rounded-2xl bg-[#1a3a3a] px-4 py-2 text-white">Curated weekly</div>
                  <div className="rounded-2xl border border-[#1a3a3a] px-4 py-2">Vendor vetted</div>
                </div>
              </div>
            </header>

            <section className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-[#132421]">Emission type focus</h2>
                <p className="text-sm text-[#54615c]">
                  Pick the emission type to view partner manufacturers, consultants, and contractors.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[activeType].map((type) => (
                  <Link
                    key={type.id}
                    href={`/partner-marketplace/${type.id}`}
                    className="rounded-full bg-[#1a3a3a] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1a3a3a]/20"
                  >
                    {"buttonLabel" in type ? type.buttonLabel : type.name}
                  </Link>
                ))}
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#56736c]">
                      Current focus
                    </p>
                    <h3 className="text-2xl font-semibold text-[#132421]">{activeType.name}</h3>
                  </div>
                  <p className="max-w-xl text-sm text-[#4f5b57]">{activeType.summary}</p>
                </div>
              </div>
            </section>

            <section className="flex animate-in flex-col gap-8 pb-10 fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2b7167]">
                  {activeType.name}
                </span>
                <h2 className="text-2xl font-semibold text-[#132421]">Partner Sections</h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {activeType.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex h-full flex-col gap-5 rounded-3xl border border-[#e6e9e3] bg-white/90 p-6 shadow-sm"
                  >
                    <div className="flex min-h-[72px] flex-col gap-2">
                      <h3 className="text-lg font-semibold text-[#152320]">{section.title}</h3>
                      <p className="text-sm text-[#6a7670]">{section.purpose}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {section.items.map((item) => {
                        const meta =
                          section.id === "manufacturers"
                            ? [
                                { label: "Product focus", value: item.focus },
                                item.tag ? { label: "Tag", value: item.tag } : null,
                              ]
                            : section.id === "consultants"
                              ? [
                                  { label: "Service focus", value: item.focus },
                                  { label: "Typical engagement", value: item.engagement },
                                ]
                              : [
                                  { label: "Execution scope", value: item.scope },
                                  item.geography ? { label: "Geography", value: item.geography } : null,
                                ]

                        const metaRows = meta.filter(Boolean) as Array<{ label: string; value: string }>

                        return (
                          <article
                            key={item.name}
                            className="flex h-[280px] flex-col justify-between gap-4 rounded-2xl border border-[#e6ece7] bg-[#fbfbf9] p-4 shadow-sm"
                          >
                            <div className="flex min-h-0 flex-col gap-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <h4 className="text-base font-semibold text-[#1a2623]">{item.name}</h4>
                                  {section.id === "manufacturers" && item.description ? (
                                    <p className="text-sm leading-relaxed text-[#6a7670]">{item.description}</p>
                                  ) : null}
                                </div>
                                {section.id === "manufacturers" && item.tag ? (
                                  <span className="rounded-full border border-[#c7ded6] bg-[#edf6f1] px-3 py-1 text-xs font-semibold text-[#2a6a5f]">
                                    {item.tag}
                                  </span>
                                ) : null}
                              </div>

                              <dl className="grid gap-3 text-sm text-[#2f3e39]">
                                {metaRows.map((row) => (
                                  <div key={row.label} className="flex flex-wrap items-baseline gap-2">
                                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6a7a75]">
                                      {row.label}:
                                    </dt>
                                    <dd className="text-sm font-medium text-[#223430]">{row.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>

                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a7a6d] transition hover:text-[#0f574e]"
                            >
                              Affiliate link
                              <span aria-hidden className="text-base">
                                -&gt;
                              </span>
                            </a>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
