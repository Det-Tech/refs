import { useRef, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { sessionStore } from "@/stores/system"
import Link from "next/link"
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline"
import { generateRecoveryKit } from "@/lib/account-settings"

export default function Backup() {
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
    <div className="mt-16 sm:mt-44 px-4 sm:px-0">
      <div className="flex flex-col gap-6 w-full sm:w-[26rem] mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6 text-white">
        <div>
          <h3 className="mb-6 text-4xl font-bold text-center">
            Backup Your Account
          </h3>
          <div className="mb-8">
            <p className="mb-2">
              Please store it somewhere safe for two reasons:
            </p>
            <ol className="list-decimal mb-2 pl-6">
              <li>
                <strong>It is powerful:</strong>
                Anyone with this recovery kit will have access to all of your
                private data.
              </li>
              <li>
                <strong>It&apos;s your backup plan:</strong>
                If you lose access to your connected devices, this kit will help
                you recover your private data.
              </li>
            </ol>
            <p>
              So, keep it somewhere you keep things you don&apos;t want to lose
              or have stolen.
            </p>
          </div>
          <a
            className=" flex justify-center items-center gap-2 w-full cursor-pointer text-center rounded-md white shadow-btn px-4 bg-sky text-black hover:bg-sky-400  py-3"
            ref={downloadLinkRef}
          >
            <div className="flex items-center w-5 h-5">
              <ArrowDownOnSquareIcon />
            </div>
            Download recovery key
          </a>
          <div className="flex justify-center mt-4">
            <Link href="/" className="underline">
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
