import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as odd from "@oddjs/odd"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import clipboardCopy from "clipboard-copy"
import Button from "@/components/common/Button"
import { appName } from "@/config/app-info"
import { createAccountLinkingConsumer } from "@/lib/auth/linking"
import { loadAccount } from "@/lib/auth/account"

export default function LinkDevice() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hashedUsername = searchParams.get("hashedUsername")
  const username = searchParams.get("username")
  const fullUsername = decodeURIComponent(username)

  const [pin, setPin] = useState<string>("")

  let accountLinkingConsumer: odd.AccountLinkingConsumer

  const initAccountLinkingConsumer = async () => {
    const accountLinkingConsumer =
      await createAccountLinkingConsumer(hashedUsername)

    accountLinkingConsumer?.on("challenge", ({ pin }) => {
      setPin(pin.join(""))
    })

    accountLinkingConsumer?.on("link", async ({ approved }) => {
      if (approved) {
        await loadAccount(hashedUsername, fullUsername)

        toast.success("You're now connected!")
        router.push("/")
      } else {
        toast.info("The connection attempt was cancelled")
        router.push("/")
      }
    })
  }

  const handleCopyCode = async () => {
    await clipboardCopy(pin)
    toast.success("Copied to clipboard")
  }

  const cancelConnection = async () => {
    toast.info("The connection attempt was cancelled")

    accountLinkingConsumer?.cancel()
    router.push("/")
  }

  const useMountEffect = () =>
    useEffect(() => {
      initAccountLinkingConsumer()
    }, [])

  useMountEffect()

  return (
    <div className="mt-44">
      <h1 className="text-3xl text-center font-bold text-white">
        Connect to {appName}
      </h1>
      <div className="flex flex-col gap-6 w-96 mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6 text-white">
        <div className="w-full">
          <div className="grid grid-flow-row auto-rows-max gap-4 justify-items-center">
            {pin && (
              <span
                onClick={handleCopyCode}
                className="btn text-base-100 hover:text-base-100 bg-base-content hover:bg-base-content border-0 rounded-full tracking-[.18em] w-3/4 cursor-pointer text-5xl font-semibold text-center"
              >
                {pin}
              </span>
            )}
            <span className="text-lg font-semibold text-center">
              Enter this code on your connected device.
            </span>
            <div className="grid grid-flow-col auto-cols-max gap-4 justify-center items-center text-slate-500 py-4">
              <span className="rounded-lg border-t-2 border-l-2 border-slate-600 dark:border-slate-50 w-4 h-4 block animate-spin" />
              Waiting for a response...
            </div>
          </div>
          <div className="mt-6">
            <Button
              type="trans"
              title="Cancel Request"
              onClick={cancelConnection}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
