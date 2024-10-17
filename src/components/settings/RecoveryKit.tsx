import { useRef, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { ArrowDownOnSquareIcon, CheckIcon } from "@heroicons/react/24/outline"
import LinkButton from "../common/LinkButton"
import { sessionStore } from "@/stores/system"
import { generateRecoveryKit } from "@/lib/account-settings"

export default function RecoveryKit() {
  const session = useRecoilValue(sessionStore)
  const [fileURL, setFileURL] = useState(null)
  const downloadLinkRef = useRef(null)

  const prepareRecoveryKitDownload = async () => {
    const recoveryKit = await generateRecoveryKit()
    const data = new Blob([recoveryKit], { type: "text/plain" })

    if (fileURL !== null) {
      window.URL.revokeObjectURL(fileURL)
    }

    const localFileURL = window.URL.createObjectURL(data)
    setFileURL(localFileURL)
  }

  const useMountEffect = () =>
    useEffect(() => {
      prepareRecoveryKitDownload()
    }, [])

  useMountEffect()

  useEffect(() => {
    if (downloadLinkRef && fileURL) {
      downloadLinkRef.current?.setAttribute(
        "download",
        `Etherland-RecoveryKit-${session.username.trimmed}.txt`
      )
      downloadLinkRef.current.href = fileURL
    }
  }, [downloadLinkRef, fileURL])

  return (
    <div className="bg-white w-full p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Recovery Kit</h2>
      <div>
        Your recovery kit will restore access to your data in the event that you
        lose access to all of your connected devices. We recommend you store
        your kit in a safe place, separate from those devices.
      </div>
      <div className="flex justify-start">
        <a
          className="flex justify-center items-center gap-2 cursor-pointer text-center rounded-md white shadow-btn px-6 py-2 select-none bg-sky-400 text-white hover:bg-sky-500 mt-4"
          ref={downloadLinkRef}
        >
          <div className="flex items-center w-5 h-5">
            <ArrowDownOnSquareIcon />
          </div>
          Download recovery key
        </a>
      </div>
    </div>
  )
}
