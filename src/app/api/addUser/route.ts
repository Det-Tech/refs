import { NextRequest, NextResponse } from "next/server"
import { addUser } from "@/utils/server"

export async function POST(req: NextRequest) {
  const { name, hashed, fullName } = await req.json()
  const response = await addUser(name, hashed, fullName)

  return NextResponse.json(response)
}
