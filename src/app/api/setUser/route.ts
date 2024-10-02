import { NextRequest, NextResponse } from "next/server"
import { setUser } from "@/utils/server"

export async function POST(req: NextRequest) {
  const { name, hashed, fullName } = await req.json()
  const response = await setUser(name, hashed, fullName)

  // return NextResponse.json(response)
  return NextResponse.json(true)
}
