"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"

export default function NewWebsitePage() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [domain, setDomain] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !domain) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await apiClient.createWebsite(name, domain)

      toast({
        title: "Website created",
        description: `${name} has been successfully added.`,
      })

      router.push(`/dashboard/websites/${result.website.id}`)
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Website</h1>
          <p className="text-muted-foreground">Create an AI assistant for your website</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Information
            </CardTitle>
            <CardDescription>Enter your website details to get started with your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  A friendly name for your website that will be displayed in the dashboard.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Your website's domain name (without https://).</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Website"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/websites">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
