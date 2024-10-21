import { NextRequest, NextResponse } from "next/server"
import { setSharedList } from "@/utils/server"

export async function POST(req: NextRequest) {
  const { id, shareList } = await req.json()
  const response = await setSharedList(id, shareList)

  return NextResponse.json(response)
}
