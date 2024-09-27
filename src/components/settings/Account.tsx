"use client"

import AvatarUpload from "./AvatarUpload"
import Username from "./Username"
import RecoveryKit from "./RecoveryKit"

export default function Account() {
  return (
    <div className="flex flex-col p-6 h-full">
        <div className="flex flex-col justify-center items-start gap-4">
          <AvatarUpload />
          <Username />
          <RecoveryKit />
        </div>
    </div>
  )
}
