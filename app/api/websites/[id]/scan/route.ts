import { type NextRequest, NextResponse } from "next/server"
import { scanWebsite } from "@/lib/actions/websites"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const websiteId = Number.parseInt(params.id)
    const result = await scanWebsite(websiteId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: result.message })
  } catch (error) {
    console.error("Scan website error:", error)
    return NextResponse.json({ error: "Failed to scan website" }, { status: 500 })
  }
}
