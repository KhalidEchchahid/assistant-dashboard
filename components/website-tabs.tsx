"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface WebsiteTabsProps {
  id: string
}

export function WebsiteTabs({ id }: WebsiteTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Overview",
      href: `/dashboard/websites/${id}`,
      active: pathname === `/dashboard/websites/${id}`,
    },
    {
      name: "Data Sources",
      href: `/dashboard/websites/${id}/data-sources`,
      active: pathname === `/dashboard/websites/${id}/data-sources`,
    },
    {
      name: "Scan Pages",
      href: `/dashboard/websites/${id}/scan`,
      active: pathname === `/dashboard/websites/${id}/scan`,
    },
    {
      name: "Embed Code",
      href: `/dashboard/websites/${id}/embed`,
      active: pathname === `/dashboard/websites/${id}/embed`,
    },
    {
      name: "Settings",
      href: `/dashboard/websites/${id}/settings`,
      active: pathname === `/dashboard/websites/${id}/settings`,
    },
  ]

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "py-4 text-sm font-medium transition-colors hover:text-foreground/80",
              tab.active ? "border-b-2 border-primary text-foreground" : "text-muted-foreground",
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
