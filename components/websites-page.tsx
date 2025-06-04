"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Globe, Search, Filter, MoreVertical, ExternalLink, Edit, Trash2, Calendar, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Website } from "@/lib/api-client"

export function WebsitesPage() {
  const [loading, setLoading] = useState(true)
  const [websites, setWebsites] = useState<Website[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadWebsites()
  }, [])

  useEffect(() => {
    const filtered = websites.filter(
      (website) =>
        website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.domain.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredWebsites(filtered)
  }, [websites, searchQuery])

  const loadWebsites = async () => {
    try {
      const data = await apiClient.getWebsites()
      setWebsites(data)
    } catch (error) {
      console.error("Failed to load websites:", error)
      toast({
        title: "Error",
        description: "Failed to load websites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (websiteId: number, websiteName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${websiteName}"? This action cannot be undone.`)

    if (!confirmed) return

    try {
      await apiClient.deleteWebsite(websiteId)
      setWebsites(websites.filter((w) => w.id !== websiteId))
      toast({
        title: "Website deleted",
        description: "The website has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete website:", error)
      toast({
        title: "Error",
        description: "Failed to delete website. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
          <p className="text-muted-foreground">Manage your websites and their AI assistants</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/websites/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Website
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : websites.length}</div>
            <p className="text-xs text-muted-foreground">{websites.length === 1 ? "website" : "websites"} configured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{loading ? "..." : websites.length}</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : websites.filter((w) => {
                    const created = new Date(w.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
            </div>
            <p className="text-xs text-muted-foreground">websites added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Setup</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2min</div>
            <p className="text-xs text-muted-foreground">time to configure</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Websites Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[280px]">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredWebsites.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No websites found" : "No websites yet"}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? `No websites match "${searchQuery}". Try adjusting your search.`
                : "Get started by adding your first website to create an AI assistant."}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/dashboard/websites/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Website
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredWebsites.map((website) => (
            <Card key={website.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {website.name}
                      </CardTitle>
                      <CardDescription className="truncate">{website.domain}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/websites/${website.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/websites/${website.id}/settings`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Website</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                        onClick={() => handleDelete(website.id, website.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Website</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                  >
                    Active
                  </Badge>
                  <span className="text-xs text-muted-foreground">{getTimeAgo(website.created_at)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{formatDate(website.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-green-600">Operational</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/websites/${website.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Manage Website
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {!loading && websites.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Ready to add another website?</h3>
                <p className="text-muted-foreground">Expand your AI assistant network by connecting more websites.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/websites/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Website
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/api-keys">View API Keys</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
