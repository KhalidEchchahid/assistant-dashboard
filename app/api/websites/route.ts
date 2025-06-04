import { type NextRequest, NextResponse } from "next/server"
import { getWebsites, createWebsite } from "@/lib/actions/websites"

export async function GET(request: NextRequest) {
  try {
    const result = await getWebsites()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Get websites error:", error)
    return NextResponse.json({ error: "Failed to get websites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await createWebsite(formData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Create website error:", error)
    return NextResponse.json({ error: "Failed to create website" }, { status: 500 })
  }
}
