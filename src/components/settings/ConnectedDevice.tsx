import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useRecoilState, useRecoilValue } from "recoil"
import QRCode from "qrcode-svg"
import ConnectModal from "../auth/link/ConnectModal"
import DelegateModal from "../auth/link/DelegateModal"
import Button from "../common/Button"
import { toast } from "react-toastify"
import { createAccountLinkingProducer } from "@/lib/auth/linking"
import { setBackupStatus } from "@/lib/auth/backup"
import { LinkIcon } from "@heroicons/react/24/outline"
import { sessionStore, filesystemStore } from "@/stores/system"

export default function ConnectedDevice() {
  const fs = useRecoilValue(filesystemStore)
  const [session, setSession] = useRecoilState(sessionStore)
  const [isConnectOpen, setIsConnectOpen] = useState<boolean>(false)
  const [isDelegateOpen, setIsDelegateOpen] = useState<boolean>(false)
  const [qrcode, setQrcode] = useState<string>("")
  const [connectionLink, setConnectionLink] = useState<string>("")
  const [pin, setPin] = useState<number[]>()
  const [pinInput, setPinInput] = useState<string>("")
  const [pinError, setPinError] = useState<boolean>(false)
  const [confirmPin, setConfirmPin] = useState<() => void>(() => undefined)
  const [rejectPin, setRejectPin] = useState<() => void>(() => undefined)

  const initAccountLinkingProducer = async (username: string) => {
    const accountLinkingProducer = await createAccountLinkingProducer(username)

    accountLinkingProducer.on("challenge", (detail) => {
      setPin(detail.pin)
      setConfirmPin(detail.confirmPin)
      setRejectPin(detail.rejectPin)
      setIsConnectOpen(false)
      setIsDelegateOpen(true)
    })

    accountLinkingProducer.on("link", async ({ approved }) => {
      if (approved) {
        setSession({
          ...session,
          backupCreated: true,
        })

        if (fs) {
          await setBackupStatus({ created: true })

          toast.success("You've connected a backup device!")
        } else {
          toast.error("Missing filesystem. Unable to create a backup device.")
        }
      }
    })
  }

  const cancelConnection = () => {
    rejectPin()

    toast.info("The connection attempt was cancelled")
    setIsDelegateOpen(false)
  }

  const checkPin = () => {
    if (pin?.join("") === pinInput) {
      console.log('debug', pin)
      console.log('debug', confirmPin)
      confirmPin()
    } else {
      setPinError(true)
    }
  }

  const deviceConnectHandler = useCallback(() => {
    const hashedUsername = session.username.hashed
    const fullUsername = session.username.full

    if (!hashedUsername || !fullUsername) return

    const origin = window.location.origin

    const updatedConnectionLink = `${origin}/link?hashedUsername=${hashedUsername}&username=${encodeURIComponent(
      fullUsername
    )}`
    setConnectionLink(updatedConnectionLink)

    setQrcode(
      new QRCode({
        content: updatedConnectionLink,
        color: "#171717",
        background: "#FAFAFA",
        padding: 0,
        width: 250,
        height: 250,
        join: true,
      }).svg()
    )

    initAccountLinkingProducer(hashedUsername)

    setIsConnectOpen(true)
  }, [session])

  return (
    <div className="bg-white w-full p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Connected Device</h2>
      <div>You have connected at least one other device.</div>
      <div className="flex justify-start items-center mt-4">
        <Button
          type="sky"
          className="py-2 px-6"
          title="Connect an additional device"
          LeftIcon={<LinkIcon className="w-4" />}
          onClick={() => deviceConnectHandler()}
        />
      </div>
      <ConnectModal
        isOpen={isConnectOpen}
        setIsOpen={setIsConnectOpen}
        qrCode={qrcode}
        connectedLink={connectionLink}
      />

      <DelegateModal
        isOpen={isDelegateOpen}
        setIsOpen={setIsDelegateOpen}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinError={pinError}
        setPinError={setPinError}
        cancelConnection={cancelConnection}
        checkPin={checkPin}
      />
    </div>
  )
}
