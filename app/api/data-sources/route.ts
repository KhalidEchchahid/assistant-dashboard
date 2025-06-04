import { type NextRequest, NextResponse } from "next/server"
import { uploadDataSource } from "@/lib/actions/data-sources"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await uploadDataSource(formData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Upload data source error:", error)
    return NextResponse.json({ error: "Failed to upload data source" }, { status: 500 })
  }
}
