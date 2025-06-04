import { type NextRequest, NextResponse } from "next/server"
import { getDataSources } from "@/lib/actions/data-sources"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const websiteId = Number.parseInt(params.id)
    const result = await getDataSources(websiteId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Get data sources error:", error)
    return NextResponse.json({ error: "Failed to get data sources" }, { status: 500 })
  }
}
