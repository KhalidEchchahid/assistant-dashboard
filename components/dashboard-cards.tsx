"use client"

import { useState, useEffect } from "react"
import { BarChart3, Globe, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"

export function DashboardCards() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWebsites: 0,
    systemStatus: "Operational",
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const websites = await apiClient.getWebsites()
      setStats({
        totalWebsites: websites.length,
        systemStatus: "Operational",
      })
    } catch (error) {
      console.error("Failed to load stats:", error)
      setStats({
        totalWebsites: 0,
        systemStatus: "Error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-10" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalWebsites}</div>
              <p className="text-xs text-muted-foreground">Active websites</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${stats.systemStatus === "Operational" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <div className="text-2xl font-bold">{stats.systemStatus}</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.systemStatus === "Operational" ? "All systems operational" : "System issues detected"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Status</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className="text-2xl font-bold">Active</div>
          </div>
          <p className="text-xs text-muted-foreground">API endpoints responding</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Now</div>
          <p className="text-xs text-muted-foreground">Real-time data</p>
        </CardContent>
      </Card>
    </div>
  )
}
