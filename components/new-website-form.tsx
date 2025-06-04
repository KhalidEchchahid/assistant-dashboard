"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
// Remove this import
// import { useAuth } from "@/contexts/auth-context"

export function NewWebsiteForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [domain, setDomain] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  // Remove this line from the component
  // const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !domain.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    // Remove user email validation since backend handles authentication
    setLoading(true)

    try {
      const website = await apiClient.createWebsite(name.trim(), domain.trim())
      toast({
        title: "Website created",
        description: "Your website has been successfully added.",
      })
      router.push(`/dashboard/websites/${website.id}`)
    } catch (error) {
      console.error("Failed to create website:", error)
      toast({
        title: "Error",
        description: "Failed to create website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New Website</CardTitle>
          <CardDescription>
            Connect a new website to your AI assistant to start extracting and processing content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                placeholder="My E-commerce Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="mystore.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={loading}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">Enter the domain without http:// or https://</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Creating..." : "Create Website"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
