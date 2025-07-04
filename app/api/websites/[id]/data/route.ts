import { type NextRequest, NextResponse } from "next/server"
import { getWebsiteData } from "@/lib/actions/websites"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const websiteId = Number.parseInt(params.id)
    const result = await getWebsiteData(websiteId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Get website data error:", error)
    return NextResponse.json({ error: "Failed to get website data" }, { status: 500 })
  }
}
