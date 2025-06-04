"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface ApiKeySectionProps {
  id: string
}

export function ApiKeySection({ id }: ApiKeySectionProps) {
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [regenerating, setRegenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setApiKey("sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz")
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

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
      setApiKey("sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
      setRegenerating(false)
      toast({
        title: "API key regenerated",
        description: "A new API key has been generated for this website.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key</CardTitle>
        <CardDescription>Use this API key to authenticate requests from your website.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Input value={apiKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy API key</span>
              </Button>
            </div>
            <Button variant="outline" onClick={handleRegenerate} disabled={regenerating} className="w-full">
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
