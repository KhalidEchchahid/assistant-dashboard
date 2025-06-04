"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useState } from "react"

export function AuthDebug() {
  const { user, loading } = useAuth()
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const testAuth = async () => {
    setTestLoading(true)
    try {
      const status = await apiClient.getAuthStatus()
      setAuthStatus(status)
      console.log("Auth status:", status)
    } catch (error) {
      console.error("Auth test failed:", error)
      setAuthStatus({ error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  const checkCookies = () => {
    console.log("All cookies:", document.cookie)
    const cookies = document.cookie.split(";").reduce(
      (acc, cookie) => {
        const [name, value] = cookie.trim().split("=")
        acc[name] = value
        return acc
      },
      {} as Record<string, string>,
    )
    console.log("Parsed cookies:", cookies)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">Auth Context:</h4>
          <pre className="bg-muted p-2 rounded text-sm overflow-auto">{JSON.stringify({ user, loading }, null, 2)}</pre>
        </div>

        <div className="flex gap-2">
          <Button onClick={testAuth} disabled={testLoading}>
            {testLoading ? "Testing..." : "Test Auth Status"}
          </Button>
          <Button onClick={checkCookies} variant="outline">
            Check Cookies
          </Button>
        </div>

        {authStatus && (
          <div>
            <h4 className="font-medium">API Auth Status:</h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-auto">{JSON.stringify(authStatus, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
