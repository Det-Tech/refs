"use client"

import dynamic from "next/dynamic"

const Recover = dynamic(() => import("@/components/auth/register/Recover"), {
  ssr: false,
})

export default function RecoverPage() {
  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <Recover />
    </main>
  )
}
