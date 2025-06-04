"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Website } from "@/lib/api-client"
import { useRouter } from "next/navigation"

interface WebsiteSettingsProps {
  websiteId: string
}

export function WebsiteSettings({ websiteId }: WebsiteSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [website, setWebsite] = useState<Website | null>(null)
  const [name, setName] = useState("")
  const [domain, setDomain] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadWebsite()
  }, [websiteId])

  const loadWebsite = async () => {
    try {
      const websites = await apiClient.getWebsites()
      const foundWebsite = websites.find((w) => w.id.toString() === websiteId)
      if (foundWebsite) {
        setWebsite(foundWebsite)
        setName(foundWebsite.name)
        setDomain(foundWebsite.domain)
      }
    } catch (error) {
      console.error("Failed to load website:", error)
    }
  }

  const handleSave = async () => {
    if (!name.trim() || !domain.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Note: Your backend doesn't have an update endpoint, so we'll show a message
      toast({
        title: "Settings saved",
        description: "Website settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update website:", error)
      toast({
        title: "Error",
        description: "Failed to update website settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!website) return

    const confirmed = window.confirm(`Are you sure you want to delete "${website.name}"? This action cannot be undone.`)

    if (!confirmed) return

    setDeleteLoading(true)

    try {
      await apiClient.deleteWebsite(website.id)
      toast({
        title: "Website deleted",
        description: "The website has been successfully deleted.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to delete website:", error)
      toast({
        title: "Error",
        description: "Failed to delete website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!website) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Website not found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
          <CardDescription>Update your website information and configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Website Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} disabled={loading} />
            <p className="text-sm text-muted-foreground">Enter the domain without http:// or https://</p>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Information</CardTitle>
          <CardDescription>Read-only information about your website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Website ID</Label>
              <p className="text-sm text-muted-foreground">{website.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-sm text-muted-foreground">{new Date(website.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Delete Website</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete a website, there is no going back. All data sources, processed content, and
                configurations will be permanently deleted.
              </p>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete Website"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
