import { type NextRequest, NextResponse } from "next/server"
import { deleteDataSource } from "@/lib/actions/data-sources"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dataSourceId = Number.parseInt(params.id)
    const result = await deleteDataSource(dataSourceId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ detail: result.message })
  } catch (error) {
    console.error("Delete data source error:", error)
    return NextResponse.json({ error: "Failed to delete data source" }, { status: 500 })
  }
}
