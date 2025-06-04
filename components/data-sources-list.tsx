"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Globe,
  Database,
  Code,
  MoreVertical,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type DataSource } from "@/lib/api-client"

interface DataSourcesListProps {
  websiteId: string
}

export function DataSourcesList({ websiteId }: DataSourcesListProps) {
  const [loading, setLoading] = useState(true)
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadDataSources()
  }, [websiteId])

  const loadDataSources = async () => {
    try {
      const sources = await apiClient.getDataSources(Number.parseInt(websiteId))
      setDataSources(sources)
    } catch (error) {
      console.error("Failed to load data sources:", error)
      toast({
        title: "Error",
        description: "Failed to load data sources. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sitemap":
        return <Globe className="h-4 w-4" />
      case "url":
        return <Globe className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "custom":
        return <Code className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800 flex gap-1 items-center"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800 flex gap-1 items-center"
          >
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        )
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800 flex gap-1 items-center"
          >
            <RefreshCw className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800 flex gap-1 items-center"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteDataSource(id)
      setDataSources(dataSources.filter((ds) => ds.id !== id))
      toast({
        title: "Data source deleted",
        description: "The data source has been removed from this website.",
      })
    } catch (error) {
      console.error("Failed to delete data source:", error)
      toast({
        title: "Error",
        description: "Failed to delete data source. Please try again.",
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
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources.length > 0 ? (
                dataSources.map((dataSource) => (
                  <TableRow key={dataSource.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(dataSource.type)}
                        <span className="capitalize">{dataSource.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-[300px] truncate" title={dataSource.source}>
                      {dataSource.source}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(dataSource.status)}
                        {dataSource.error && (
                          <p className="text-xs text-red-600 dark:text-red-400" title={dataSource.error}>
                            {dataSource.error.length > 50
                              ? `${dataSource.error.substring(0, 50)}...`
                              : dataSource.error}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(dataSource.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDelete(dataSource.id)}
                            className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No data sources found. Add your first data source to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
