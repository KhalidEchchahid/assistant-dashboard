"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Globe, MoreVertical, ExternalLink, Edit, Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient, type Website } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function WebsitesList() {
  const [loading, setLoading] = useState(true)
  const [websites, setWebsites] = useState<Website[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadWebsites()
  }, [])

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

  const handleDelete = async (websiteId: number) => {
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

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    // Check if the difference is finite
    if (!isFinite(diffInDays)) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }

    // For very large differences, fall back to absolute date
    if (Math.abs(diffInDays) > 365) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }

    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffInDays, "day")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Websites</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        {loading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground p-6">
            <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No websites yet</p>
            <p>Add your first website to get started with your AI assistant.</p>
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Domain</TableHead>
                  <TableHead className="min-w-[100px]">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/websites/${website.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{website.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="truncate">{website.domain}</TableCell>
                    <TableCell>{formatDate(website.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                            onClick={() => handleDelete(website.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Website</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
