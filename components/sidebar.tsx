"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  User,
  List,
  ClipboardPenLine,
  Globe2,
  Server,
  FileCheck,
  Grid3x3,
  ChevronLeft,
  BarChart3,
  LineChart,
  Lightbulb,
  Download,
  Building2,
  Users,
  Briefcase,
  FolderKanban,
  FileText,
  Target,
  CheckSquare,
  Calculator,
  Newspaper,
  LucideNewspaper,
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
} from "lucide-react"
import { appConfig } from "@/lib/config"

type NavItem = {
  icon?: React.ComponentType<{ className?: string }>
  customIconSrc?: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  { customIconSrc: "/myprofile.svg", label: "My Profile", href: "" },
  { customIconSrc: "/assessments.svg", label: "Reporting", href: "/reporting" },
  { icon: LineChart, label: "Decarbonization Strategies", href: "/decarbonization-strategies" },
  { customIconSrc: "/nexus.svg", label: "Bulk Processing", href: "/" },
  ...(appConfig.enableAppBuilderPage ? [{ icon: Lightbulb, label: "App Builder", href: "/app-builder" }] : []),
  { icon: Calculator, label: "Scope 3", href: "" },
  { customIconSrc: "/analytics.svg", label: "Analytics", href: "" },
  { customIconSrc: "/analytics.svg", label: "Data Insights", href: "" },
  { icon: FileSpreadsheet, label: "Export", href: "" },
  { customIconSrc: "/supplier.svg", label: "Subsidiary Overview", href: "" },
  { customIconSrc: "/supplier.svg", label: "Entity Overview", href: "" },
  { customIconSrc: "/supplier.svg", label: "Portfolio Overview", href: "" },
  { customIconSrc: "/supplier.svg", label: "Project Overview", href: "" },
  { customIconSrc: "/certificate-finder.svg", label: "Portfolio Customer L", href: "" },
  { icon: Target, label: "Target Set", href: "" },
  { customIconSrc: "/approval.svg", label: "Approval", href: "" },
  { customIconSrc: "/company.svg", label: "Companies", href: "" },
  { customIconSrc: "/data-vault.svg", label: "Data Vault", href: "" },
  { customIconSrc: "/certificate-finder.svg", label: "Certificates", href: "" },
  { icon: Grid3x3, label: "Portfolios", href: "" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={`${
        collapsed ? "w-[60px]" : "w-[180px]"
      } bg-[#cae0e0] flex flex-col min-h-screen transition-all duration-200 flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <div className="flex items-center">
            <span className="text-[#238F85] font-bold text-lg">ESG</span>
            <span className="text-black font-normal text-lg">pedia</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-black/60 hover:text-black/80 transition-colors"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="flex items-center gap-2 px-4 py-2">
          <User className="h-4 w-4 text-black/80" />
          <span className="text-xs text-black/80 truncate">Demo_user01</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-3 text-[13px] font-normal transition-colors
                ${isActive ? "bg-[#238F85] text-white mx-2 rounded-lg" : "text-black/90 hover:bg-black/10"}
              `}
            >
              {item.customIconSrc ? (
                <Image
                  src={item.customIconSrc}
                  alt={`${item.label} icon`}
                  width={16}
                  height={16}
                  className="h-4 w-4 flex-shrink-0 object-contain"
                />
              ) : (
                item.icon && <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-black" : "text-black/70"}`} />
              )}
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
