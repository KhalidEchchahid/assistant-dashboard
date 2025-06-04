"use client"

import { useState } from "react"
import { Plus, Upload, Globe, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface AddDataSourceButtonProps {
  websiteId: string
}

export function AddDataSourceButton({ websiteId }: AddDataSourceButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const [sitemapValue, setSitemapValue] = useState("")
  const [customValue, setCustomValue] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (type: string) => {
    setLoading(true)

    try {
      let source = ""
      let fileToUpload: File | undefined = undefined

      switch (type) {
        case "url":
          source = urlValue
          break
        case "sitemap":
          source = sitemapValue
          break
        case "custom":
          source = customValue
          break
        case "file":
          fileToUpload = file || undefined
          break
      }

      await apiClient.uploadDataSource(Number.parseInt(websiteId), type, source, fileToUpload)

      setLoading(false)
      setOpen(false)

      // Reset form
      setUrlValue("")
      setSitemapValue("")
      setCustomValue("")
      setFile(null)

      toast({
        title: "Data source added",
        description: `The ${type} data source has been added successfully.`,
      })

      // Refresh the page to show the new data source
      window.location.reload()
    } catch (error) {
      console.error("Failed to add data source:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to add data source. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Data Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>Add a new data source to extract content from your website.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/page"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Enter a specific URL to extract content from.</p>
            </div>

            <DialogFooter>
              <Button onClick={() => handleSubmit("url")} disabled={!urlValue || loading}>
                {loading ? (
                  <>
                    <Globe className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Add URL
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sitemap">Sitemap URL</Label>
              <Input
                id="sitemap"
                placeholder="https://example.com/sitemap.xml"
                value={sitemapValue}
                onChange={(e) => setSitemapValue(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Enter your website's sitemap URL to extract all pages.</p>
            </div>

            <DialogFooter>
              <Button onClick={() => handleSubmit("sitemap")} disabled={!sitemapValue || loading}>
                {loading ? (
                  <>
                    <Globe className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Add Sitemap
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="file" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="grid w-full items-center gap-1.5">
                <Label
                  htmlFor="file-upload"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background p-4 text-muted-foreground hover:bg-accent/50"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">Click to upload</span>
                  <span className="text-xs">{file ? file.name : "PDF, JSON, TXT, or Markdown"}</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0])
                    }
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">Upload a file containing content to extract.</p>
            </div>

            <DialogFooter>
              <Button onClick={() => handleSubmit("file")} disabled={!file || loading}>
                {loading ? (
                  <>
                    <FileText className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom">Custom Text</Label>
              <Input
                id="custom"
                placeholder="Enter your custom text here"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Enter any custom text you want to extract content from.</p>
            </div>

            <DialogFooter>
              <Button onClick={() => handleSubmit("custom")} disabled={!customValue || loading}>
                {loading ? (
                  <>
                    <FileText className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Add Custom Text
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
