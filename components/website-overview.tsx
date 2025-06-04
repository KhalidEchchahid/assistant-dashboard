"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { apiClient, type WebsiteData } from "@/lib/api-client"

interface WebsiteOverviewProps {
  id: string
}

export function WebsiteOverview({ id }: WebsiteOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<WebsiteData | null>(null)

  useEffect(() => {
    loadWebsiteData()
  }, [id])

  const loadWebsiteData = async () => {
    try {
      const websiteData = await apiClient.getWebsiteData(Number.parseInt(id))
      setData(websiteData)
    } catch (error) {
      console.error("Failed to load website data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatStorageSize = (files: string[]) => {
    // Estimate storage size based on number of files
    const estimatedSize = files.length * 0.5 // Rough estimate: 0.5MB per file
    if (estimatedSize < 1) return `${Math.round(estimatedSize * 1000)} KB`
    return `${estimatedSize.toFixed(1)} MB`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Overview</CardTitle>
        <CardDescription>Performance and statistics for this website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          </>
        ) : data ? (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Status</span>
                <span className="font-medium">{data.processed ? "Complete" : "In Progress"}</span>
              </div>
              <Progress value={data.processed ? 100 : 60} className="h-2" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data Sources</span>
                <span className="font-medium">{data.data_sources_count}</span>
              </div>
              <Progress
                value={(data.data_sources_count / Math.max(data.data_sources_count, 5)) * 100}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="font-medium">{data.storage_exists ? formatStorageSize(data.files_found) : "No data"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Vector Store</p>
                <p className="font-medium">{data.has_vector_store ? "Ready" : "Not ready"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">System Components</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div
                  className={`p-2 rounded text-center ${data.has_vector_store ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                >
                  Vector Store
                </div>
                <div
                  className={`p-2 rounded text-center ${data.has_docstore ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                >
                  Doc Store
                </div>
                <div
                  className={`p-2 rounded text-center ${data.has_metadata ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                >
                  Metadata
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Failed to load website data</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
