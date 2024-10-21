import { useEffect, useState } from "react"
import clipboardCopy from "clipboard-copy"
import { useRecoilValue } from "recoil"
import {
  ClipboardDocumentCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import { sessionStore } from "@/stores/system"

const Username = () => {
  const session = useRecoilValue(sessionStore)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopyUsername = async (): Promise<void> => {
    await clipboardCopy(session.userInfo.hashed)
    toast.success("Copied to clipboard")
    setIsCopied(true)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCopied(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [isCopied])

  return (
    <div className="bg-white p-6 rounded-lg w-full">
      <h2 className="text-xl font-bold mb-2">Username</h2>
      <div className="flex flex-col gap-1">
        <div>Name: {session.userInfo.trimmed}</div>
        <div className="flex">
          <div className="break-words">Hashed: {session.userInfo.hashed}</div>

          {isCopied ? (
            <div className="flex justify-center gap-1 text-green-600 ml-2">
              <CheckIcon className="w-6" />
              <span>Copied</span>
            </div>
          ) : (
            <button
              className="pl-2 hover:text-neutral-500 transition-colors"
              onClick={handleCopyUsername}
            >
              <ClipboardDocumentCheckIcon className="w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Username
