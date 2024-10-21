"use client"

import { useEffect, useState } from "react"
import { UsersIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { useRecoilState, useRecoilValue } from "recoil"
import AllUsers from "./All"
import SharedUsers from "./Shared"
import { sessionStore } from "@/stores/system"
import { contactListStore } from "@/stores/data"
import { IUser, type ContactListTab } from "@/config/interfaces"

const Tab = ({
  isActive,
  icon,
  title,
  changeTab,
}: {
  isActive: boolean
  icon: React.ReactNode
  title: ContactListTab
  changeTab: (val: ContactListTab) => void
}) => {
  return (
    <button
      className={`flex justify-center items-center gap-2 w-full select-none cursor-pointer text-center px-6 py-2 text-lg ${isActive ? "bg-green text-white" : "bg-white text-black"} capitalize`}
      onClick={() => {
        changeTab(title)
      }}
    >
      <div className="flex items-center w-5 h-5">{icon}</div>
      {title.toLowerCase()}
    </button>
  )
}

export default function ContactList() {
  const session = useRecoilValue(sessionStore)
  const [contactList, setContactList] = useRecoilState(contactListStore)

  const fetchHandler = async () => {
    const _users = await fetch("/api/getUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const allUsers = await _users.json()

    setContactList({
      ...contactList,
      all: allUsers.filter((user: IUser) => user.id !== session.userInfo.id),
      shared: allUsers.filter((user: IUser) =>
        session.userInfo.sharedList.includes(user.id.toString())
      ),
    })
  }

  useEffect(() => {
    fetchHandler()
  }, [])

  return (
    <div className="flex flex-col p-6 h-full relative">
      <div className="flex absolute left-16">
        <div className="flex items-center rounded-md overflow-hidden">
          <Tab
            isActive={contactList.tab === "all"}
            icon={<UsersIcon />}
            title="all"
            changeTab={(v) =>
              setContactList({
                ...contactList,
                tab: v,
                searchName: "",
              })
            }
          />
          <Tab
            isActive={contactList.tab === "shared"}
            icon={<UserGroupIcon />}
            title="shared"
            changeTab={(v) =>
              setContactList({
                ...contactList,
                tab: v,
                searchName: "",
              })
            }
          />
        </div>
      </div>
      <div className="border-2 border-white h-full rounded-lg mt-6 p-6 pt-12">
        {contactList.tab === "all" ? <AllUsers /> : <SharedUsers />}
      </div>
    </div>
  )
}
