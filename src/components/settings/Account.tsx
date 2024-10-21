"use client"

import { useEffect } from "react"
import AvatarUpload from "./AvatarUpload"
import Username from "./Username"
import ConnectedDevice from "./ConnectedDevice"
import RecoveryKit from "./RecoveryKit"
import { useRecoilValue } from "recoil"
import { sessionStore } from "@/stores/system"

export default function Account() {
  const session = useRecoilValue(sessionStore)

  const useMountEffect = () =>
    useEffect(() => {
      const fetchHandler = async () => {
        try {
          await fetch("/api/addUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: session.userInfo.trimmed,
              hashed: session.userInfo.hashed,
              fullName: session.userInfo.full,
            }),
          })
        } catch (error) {
          throw new Error(error)
        }
      }
      fetchHandler()
    }, [])

  useMountEffect()

  return (
    <div className="flex flex-col p-6 h-full">
      <div className="flex flex-col justify-center items-start gap-4">
        <AvatarUpload />
        <Username />
        <ConnectedDevice />
        <RecoveryKit />
      </div>
    </div>
  )
}
