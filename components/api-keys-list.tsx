"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export function ApiKeysList() {
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const { toast } = useToast()

  // Mock API key for display (in real implementation, you'd fetch this from your backend)
  const [apiKey] = useState("sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  const handleRegenerate = () => {
    setRegenerating(true)

    // Simulate API call
    setTimeout(() => {
      setRegenerating(false)
      toast({
        title: "API key regenerated",
        description: "A new API key has been generated. Make sure to update your applications.",
      })
    }, 2000)
  }

  const maskedKey = apiKey.substring(0, 12) + "•".repeat(20) + apiKey.substring(apiKey.length - 8)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>Use this API key to authenticate requests to the AI Assistant API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Input value={showKey ? apiKey : maskedKey} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showKey ? "Hide" : "Show"} API key</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRegenerate} disabled={regenerating} className="flex-1">
                  {regenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Key
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Information about your API key usage and limits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Requests/month</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to integrate with the AI Assistant API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Authentication</h4>
            <p className="text-sm text-muted-foreground">Include your API key in the request headers:</p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>X-API-Key: {showKey ? apiKey : maskedKey}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Base URL</h4>
            <pre className="bg-muted p-3 rounded text-sm">
              <code>{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Example Request</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`curl -X GET "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/websites/" \\
  -H "X-API-Key: ${showKey ? apiKey : maskedKey}"`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
