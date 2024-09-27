"use client"

import { useRecoilValue } from "recoil"
import { sessionStore } from "@/stores/system"
import dynamic from "next/dynamic"

const Register = dynamic(() => import("@/components/auth/register/Register"), {
  ssr: false,
})

const Welcome = dynamic(() => import("@/components/auth/register/Welcome"), {
  ssr: false,
})

export default function RegisterPage() {
  const session = useRecoilValue(sessionStore)

  return (
    <main className="flex flex-col flex-1 min-h-screen">
      {session.session ? <Welcome /> : <Register />}
    </main>
  )
}
