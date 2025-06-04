"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient, type Website } from "@/lib/api-client"

interface WebsiteHeaderProps {
  id: string
}

export function WebsiteHeader({ id }: WebsiteHeaderProps) {
  const [loading, setLoading] = useState(true)
  const [website, setWebsite] = useState<Website | null>(null)

  useEffect(() => {
    loadWebsite()
  }, [id])

  const loadWebsite = async () => {
    try {
      const websites = await apiClient.getWebsites()
      const foundWebsite = websites.find((w) => w.id.toString() === id)
      setWebsite(foundWebsite || null)
    } catch (error) {
      console.error("Failed to load website:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>

        {loading ? (
          <div className="space-y-2 min-w-0 flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : website ? (
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">{website.name}</h1>
              <Badge variant="default" className="w-fit">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="truncate">{website.domain}</span>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Website Not Found</h1>
            <p className="text-muted-foreground">The requested website could not be found.</p>
          </div>
        )}
      </div>

      {website && (
        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
          <a href={`https://${website.domain}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
            <span className="sm:hidden">View</span>
          </a>
        </Button>
      )}
    </div>
  )
}
