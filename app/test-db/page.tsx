"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Database, RefreshCw } from "lucide-react"
import { checkDatabaseStatus, setupDatabase } from "@/lib/db/init"

export default function SetupDbPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [setupResult, setSetupResult] = useState(null)

  const handleCheckStatus = async () => {
    setLoading(true)
    try {
      const result = await checkDatabaseStatus()
      setStatus(result)
    } catch (error) {
      console.error("Error checking status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupDatabase = async () => {
    setLoading(true)
    try {
      const result = await setupDatabase()
      setSetupResult(result)
      // Also refresh status
      const statusResult = await checkDatabaseStatus()
      setStatus(statusResult)
    } catch (error) {
      console.error("Error setting up database:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Database Setup</h1>
          <p className="text-muted-foreground">Initialize your database tables for the AI Assistant</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>Check the current status of your database tables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleCheckStatus} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>

              {status && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Connection</span>
                    <Badge variant={status.success ? "default" : "destructive"}>
                      {status.success ? "Connected" : "Failed"}
                    </Badge>
                  </div>

                  {status.success && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">All Tables</span>
                        <Badge variant={status.allTablesExist ? "default" : "secondary"}>
                          {status.allTablesExist ? "Ready" : "Missing"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tables Status:</p>
                        {["users", "websites", "data_sources", "scanned_pages"].map((table) => (
                          <div key={table} className="flex items-center justify-between text-sm">
                            <span>{table}</span>
                            {status.existingTables.includes(table) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {status.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">Error: {status.error}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Setup Database
              </CardTitle>
              <CardDescription>Create all necessary database tables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSetupDatabase} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Setup Database"
                )}
              </Button>

              {setupResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Setup Status</span>
                    <Badge variant={setupResult.success ? "default" : "destructive"}>
                      {setupResult.success ? "Success" : "Failed"}
                    </Badge>
                  </div>

                  {setupResult.success && setupResult.tables && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Created Tables:</p>
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                        {setupResult.tables.join(", ")}
                      </div>
                    </div>
                  )}

                  {setupResult.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">Error: {setupResult.error}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {status?.allTablesExist && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Database Ready!</h3>
                  <p className="text-green-700">
                    All tables are set up correctly. You can now use the authentication system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
