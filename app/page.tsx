"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"


export default function HomePage() {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-4">AI Assistant Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Create and manage AI-powered voice assistants for your websites with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">
                Add your website and start training your AI assistant in minutes.
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Integration</h3>
              <p className="text-sm text-muted-foreground">
                Upload data sources and let AI learn about your business automatically.
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Powerful Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Monitor performance and optimize your AI assistant's responses.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/auth/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
