import { Fragment, useCallback, useEffect, useState } from "react"
import { Dialog, Transition, Listbox } from "@headlessui/react"
import * as odd from "@oddjs/odd"
import clipboardCopy from "clipboard-copy"
import { useRecoilValue } from "recoil"
import { getRecoil } from "recoil-nexus"
import { toast } from "react-toastify"
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid"
import { ShareIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline"
import QRCode from "qrcode-svg"
import Button from "../common/Button"
import { filesystemStore, sessionStore } from "@/stores/system"
import { Data_DIRS } from "@/lib/data"
import { AREAS } from "@/stores/data"
import { IUser, IShare, IAlert } from "@/config/interfaces"
import "react-toastify/dist/ReactToastify.css"

const ShareModal = (props: IShare) => {
  const { program } = useRecoilValue(sessionStore)
  const [shareWith, setShareWith] = useState<string>("")
  const [qrcode, setQrcode] = useState<string>("")
  const [users, setUsers] = useState<IUser[] | null>(null)
  const [connectionLink, setConnectionLink] = useState<string>("")
  const [isInvalid, setIsInvalid] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [alertState, setAlertState] = useState<IAlert>({
    open: false,
    message: undefined,
    severity: undefined,
  })

  useEffect(() => {
    const fetchHandler = async () => {
      const _users = await fetch("/api/getUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setUsers(await _users.json())
    }

    fetchHandler()
  }, [])

  const shareHandler = async () => {
    if (isPending) return

    if (shareWith === "") {
      setIsInvalid(true)
      return
    } else {
      setIsInvalid(false)
    }

    const fs = getRecoil(filesystemStore)
    if (!fs) return

    if (!(await program.fileSystem.hasPublicExchangeKey(fs))) {
      await program.fileSystem.addPublicExchangeKey(fs)
    }

    try {
      setIsPending(true)

      const shareDetails = await fs.sharePrivate(
        [
          odd.path.combine(
            Data_DIRS[AREAS.PRIVATE],
            odd.path.file(`${props.name}`)
          ),
        ],
        { shareWith: shareWith }
      )

      const origin = window.location.origin

      const updatedConnectionLink = `${origin}/access?shareId=${shareDetails.shareId}&sharedBy=${shareDetails.sharedBy.username}`
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

      setIsPending(false)
    } catch (error) {
      toast.error(error.toString())
      setIsPending(false)
    }
  }

  const closeHandler = useCallback(() => {
    props.setIsOpen(false)

    setAlertState({
      open: false,
      message: "",
      severity: undefined,
    })
    setShareWith("")
    setConnectionLink("")
    setQrcode("")
  }, [setAlertState, props])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPending && alertState.open) {
        setAlertState({
          open: false,
          message: "",
          severity: undefined,
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPending, alertState, setAlertState])

  const handleCopyLink = async () => {
    await clipboardCopy(connectionLink)
    setIsCopied(true)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCopied) {
        setIsCopied(false)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isCopied])

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          open={props.isOpen}
          onClose={() => props.setIsOpen(true)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md md:max-w-xl transform overflow-hidden rounded-xl bg-white px-8 py-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl md:text-4xl text-center font-bionix"
                  >
                    {qrcode !== "" ? "Scan QR" : "Share File"}
                    <XMarkIcon
                      className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => closeHandler()}
                    />
                  </Dialog.Title>
                  {qrcode !== "" ? (
                    <div className="flex flex-col items-center justify-center gap-4 mb-7 rounded-lg overflow-hidden mt-6">
                      <div dangerouslySetInnerHTML={{ __html: qrcode }} />
                      <div>
                        Scan this code on your phone, or share the connection
                        link.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-12 gap-2 mt-6">
                        <div className="col-span-3">File Name: </div>
                        <div className="col-span-9">{props.name}</div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 mt-4">
                        <div className="col-span-3 content-center">
                          Share With:{" "}
                        </div>
                        <div className="col-span-9">
                          <Listbox value={shareWith} onChange={setShareWith}>
                            <div className="relative">
                              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent border border-black-semiLight py-1.5 md:py-2 pl-3 pr-10 text-left focus:outline-none h-[45px]">
                                <span className="block truncate">
                                  {shareWith !== "" &&
                                    users.filter(
                                      (user: IUser) => user.hashed === shareWith
                                    )[0]?.name +
                                      " (" +
                                      shareWith +
                                      ")"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-black-light border border-black-semiLight py-1 text-base shadow-lg focus:outline-none">
                                  {users !== null &&
                                    users.map((user: IUser, index: number) => (
                                      <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-1.5 pl-10 pr-4 ${
                                            active
                                              ? "bg-black-semiLight text-white"
                                              : "text-white"
                                          }`
                                        }
                                        value={user.hashed}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {user.name +
                                                " (" +
                                                user.hashed +
                                                ")"}
                                            </span>
                                            {selected ? (
                                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple">
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                      </div>
                    </>
                  )}

                  {connectionLink !== "" ? (
                    <div className="relative pb-2">
                      <Button
                        type="orange"
                        size="md"
                        title="Share connection link"
                        LeftIcon={<ShareIcon className="w-4" />}
                        onClick={handleCopyLink}
                      />
                      {isCopied && (
                        <div className="flex justify-center items-center gap-2 absolute -bottom-6 left-1/2 -translate-x-1/2 select-none text-green-600">
                          <CheckIcon className="w-5" />
                          Copied
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 font-lato mt-8">
                      <div className="col-span-1">
                        <button
                          type="button"
                          className={`w-full inline-flex justify-center rounded-md px-6 py-2 text-sm md:text-base  bg-sky hover:bg-sky-400 hover:text-white ${
                            isPending ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={() => shareHandler()}
                        >
                          {isPending ? "Pending ..." : "Share"}
                        </button>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          className={`w-full inline-flex justify-center rounded-md px-6 py-2 text-sm md:text-base bg-transparent hover:bg-black-semiLight border-black border`}
                          onClick={() => closeHandler()}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ShareModal
