"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw, CheckCircle, AlertCircle, Clock, ExternalLink, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { getScannedPages, scanWebsite, deepScanPage, initiateDeepScanAllPending } from "@/lib/actions/scanning"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ScannedPage {
  id: number
  url: string
  title: string | null
  status: string
  error_message: string | null
  scanned_at: string | null
}

interface WebsiteScannerProps {
  websiteId: string
}

export function WebsiteScanner({ websiteId }: WebsiteScannerProps) {
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [deepScanning, setDeepScanning] = useState(false)
  const [scannedPages, setScannedPages] = useState<ScannedPage[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadScannedPages()
  }, [websiteId])

  const loadScannedPages = async () => {
    try {
      const pages = await getScannedPages(Number.parseInt(websiteId))
      setScannedPages(pages)
    } catch (error) {
      console.error("Failed to load scanned pages:", error)
      toast({
        title: "Error",
        description: "Failed to load scanned pages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async () => {
    setScanning(true)
    try {
      const result = await scanWebsite(Number.parseInt(websiteId))
      toast({
        title: "Scan initiated",
        description: result.message,
      })
      // Reload the scanned pages after a short delay
      setTimeout(() => {
        loadScannedPages()
      }, 1000)
    } catch (error) {
      console.error("Failed to initiate scan:", error)
      toast({
        title: "Error",
        description: "Failed to initiate website scan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setScanning(false)
    }
  }

  const handleDeepScanPage = async (pageId: number, url: string) => {
    try {
      toast({
        title: "Deep scan initiated",
        description: `Starting deep scan for ${url}`,
      })

      await deepScanPage(pageId, url, Number.parseInt(websiteId))

      toast({
        title: "Deep scan complete",
        description: `Successfully scanned ${url}`,
      })

      // Reload the scanned pages
      loadScannedPages()
    } catch (error) {
      console.error("Failed to deep scan page:", error)
      toast({
        title: "Error",
        description: "Failed to deep scan page. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeepScanSelected = async () => {
    if (selectedPages.length === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one page to deep scan.",
        variant: "destructive",
      })
      return
    }

    setDeepScanning(true)
    try {
      // Get the selected pages data
      const pagesToScan = scannedPages
        .filter((page) => selectedPages.includes(page.id))
        .map((page) => ({ id: page.id, url: page.url }))

      toast({
        title: "Deep scan initiated",
        description: `Starting deep scan for ${pagesToScan.length} pages`,
      })

      await initiateDeepScanAllPending(Number.parseInt(websiteId), pagesToScan)

      toast({
        title: "Deep scan queued",
        description: `Successfully queued ${pagesToScan.length} pages for deep scanning`,
      })

      // Clear selection
      setSelectedPages([])

      // Reload the scanned pages after a short delay
      setTimeout(() => {
        loadScannedPages()
      }, 1000)
    } catch (error) {
      console.error("Failed to deep scan selected pages:", error)
      toast({
        title: "Error",
        description: "Failed to deep scan selected pages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeepScanning(false)
    }
  }

  const togglePageSelection = (pageId: number) => {
    setSelectedPages((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]))
  }

  const toggleSelectAll = () => {
    if (selectedPages.length === scannedPages.length) {
      // Deselect all
      setSelectedPages([])
    } else {
      // Select all
      setSelectedPages(scannedPages.map((page) => page.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scanned":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800 flex gap-1 items-center"
          >
            <CheckCircle className="h-3 w-3" />
            Scanned
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
      case "pending_scan":
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scanned"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusCounts = () => {
    const counts = scannedPages.reduce(
      (acc, page) => {
        acc[page.status] = (acc[page.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: scannedPages.length,
      scanned: counts.scanned || 0,
      processing: counts.processing || 0,
      pending: (counts.pending || 0) + (counts.pending_scan || 0),
      error: counts.error || 0,
    }
  }

  const stats = getStatusCounts()
  const pendingPages = scannedPages.filter((page) => page.status === "pending_scan")
  const hasSelectedPendingPages = selectedPages.some(
    (id) => scannedPages.find((page) => page.id === id)?.status === "pending_scan",
  )

  return (
    <div className="space-y-6">
      {/* Header and Scan Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Website Scanner
              </CardTitle>
              <CardDescription>Discover and scan pages on your website for content extraction</CardDescription>
            </div>
            <div className="flex gap-2">
              {pendingPages.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={deepScanning}>
                      {deepScanning ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Deep Scan All Pending
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deep Scan All Pending Pages</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will initiate a deep scan for all {pendingPages.length} pending pages. This process may
                        take some time. Do you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const pendingPageIds = pendingPages.map((page) => ({ id: page.id, url: page.url }))
                          initiateDeepScanAllPending(Number.parseInt(websiteId), pendingPageIds)
                            .then(() => {
                              toast({
                                title: "Deep scan initiated",
                                description: `Deep scan started for ${pendingPages.length} pages`,
                              })
                              setTimeout(loadScannedPages, 1000)
                            })
                            .catch(() => {
                              toast({
                                title: "Error",
                                description: "Failed to initiate deep scan. Please try again.",
                                variant: "destructive",
                              })
                            })
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button onClick={handleScan} disabled={scanning}>
                {scanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Discover Pages
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Stats */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.scanned}</div>
              <div className="text-sm text-muted-foreground">Scanned</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Pages Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discovered Pages</CardTitle>
              <CardDescription>Pages found during the website scan</CardDescription>
            </div>
            {selectedPages.length > 0 && (
              <Button
                variant="outline"
                onClick={handleDeepScanSelected}
                disabled={deepScanning || !hasSelectedPendingPages}
              >
                {deepScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Deep Scan Selected ({selectedPages.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : scannedPages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground p-6">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No pages scanned yet</p>
              <p>Click "Discover Pages" to find pages on your website.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedPages.length === scannedPages.length && scannedPages.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scanned At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scannedPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPages.includes(page.id)}
                        onCheckedChange={() => togglePageSelection(page.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-[300px] truncate" title={page.url}>
                      {page.url}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={page.title || ""}>
                      {page.title || "No title"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(page.status)}
                        {page.error_message && (
                          <p className="text-xs text-red-600 dark:text-red-400" title={page.error_message}>
                            {page.error_message.length > 50
                              ? `${page.error_message.substring(0, 50)}...`
                              : page.error_message}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(page.scanned_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {page.status === "pending_scan" && (
                          <Button variant="outline" size="sm" onClick={() => handleDeepScanPage(page.id, page.url)}>
                            <Zap className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Deep Scan</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <a href={page.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open page</span>
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
