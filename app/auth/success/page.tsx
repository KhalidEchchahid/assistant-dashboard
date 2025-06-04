"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthSuccessPage() {
  const router = useRouter()
  const { checkAuth } = useAuth()

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Wait a moment for the cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check authentication status
      await checkAuth()

      // Redirect to dashboard
      router.push("/dashboard")
    }

    handleAuthSuccess()
  }, [checkAuth, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Authentication Successful</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  )
}
