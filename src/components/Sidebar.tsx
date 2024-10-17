"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRecoilValue } from "recoil"
import { sessionStore } from "@/stores/system"
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/20/solid"
import { menus } from "@/config/data"
import { IMenu } from "@/config/interfaces"

export default function Sidebar() {
  const pathName = usePathname()
  const session = useRecoilValue(sessionStore)

  const paths = pathName.split("/")
  const path = paths.length > 2 ? "/" + paths[1] : pathName

  if (!session.session || path === "/recover") {
    return <></>
  }

  const disconnect = async () => {
    await session.session.destroy()

    window.location.href = "/"
  }

  return (
    <div className="flex flex-col justify-between w-64 bg-black-light text-white px-4 pt-16 pb-6">
      <div className="flex flex-col gap-4">
        {menus.map((menu: IMenu, index: number) => (
          <Link
            key={index}
            href={menu.link}
            className={`flex items-center gap-2 ${path === menu.link ? "bg-green" : "bg-gray-400 bg-opacity-30"} hover:bg-green w-full rounded-xl px-4 py-2`}
          >
            {<menu.icon className="w-10 h-10" />}
            {menu.title}
          </Link>
        ))}
      </div>
      <div
        className="bg-green hover:bg-green-dark flex justify-center items-center gap-2 w-full rounded-full select-none cursor-pointer px-4 py-2"
        onClick={() => disconnect()}
      >
        <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
        Disconnect
      </div>
    </div>
  )
}
