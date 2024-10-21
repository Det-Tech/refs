"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useRecoilValue } from "recoil"
import Avatar from "./settings/Avatar"
import { sessionStore } from "@/stores/system"

export default function Header() {
  const path = usePathname()
  const session = useRecoilValue(sessionStore)

  if (!session.session || path === "/recover") {
    return <></>
  }

  return (
    <div className="flex justify-between items-center bg-green-dark text-white px-4 py-2 shadow-gray-700 shadow-sm z-10">
      <Link className="flex items-center gap-4" href="/">
        <Image src="/images/logo.png" alt="logo" width={30} height={30} />
        <span className="text-xl">Etherland</span>
      </Link>
      <div>
        <Link className="flex items-center gap-2" href="/setting">
          <span>{session.userInfo?.trimmed}</span>
          <Avatar size="small" />
        </Link>
      </div>
    </div>
  )
}
