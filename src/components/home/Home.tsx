"use client"

import { useRecoilValue } from "recoil"
import { useRouter } from "next/navigation"
import { sessionStore } from "@/stores/system"
import Dashboard from "./Dashboard"
import Connect from "../auth/connect/Connect"

export default function Home() {
  const router = useRouter()
  const session = useRecoilValue(sessionStore)
  
  if (session.session) {
    router.push("/datas")
    // return <Dashboard />
  }

  return <Connect />
}
