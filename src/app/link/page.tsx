"use client"

import dynamic from "next/dynamic"

const LinkDevice = dynamic(() => import("@/components/auth/link/LinkDevice"), {
  ssr: false,
})

export default function LinkPage() {
  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <LinkDevice />
    </main>
  )
}
