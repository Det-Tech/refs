import { NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/utils/server"

export async function POST(request: NextRequest) {
  const response = await getUsers()

  // return NextResponse.json(response)
  return NextResponse.json(response)
}
