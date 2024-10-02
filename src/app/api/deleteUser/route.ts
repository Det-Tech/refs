import { NextRequest, NextResponse } from "next/server"
import { deleteUser } from "@/utils/server"

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  const response = await deleteUser(id)

  // return NextResponse.json(response)
  return NextResponse.json(true)
}