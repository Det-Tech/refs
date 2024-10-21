import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useRecoilValue } from "recoil"
import { getRecoil } from "recoil-nexus"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { filesystemStore, sessionStore } from "@/stores/system"

import { getFilesFromWNFS, deleteFileFromWNFS, Data_DIRS } from "@/lib/data"
import { AREAS } from "@/stores/data"
import { Links } from "@oddjs/odd/fs/types"
import { Link, SoftLink } from "@oddjs/odd/fs/types"
import { isSoftLink } from "@oddjs/odd/fs/types/check"

interface IAccept {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  shareId: string
  sharedBy: string
  setIsAccept: (val: boolean) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
}

const AcceptModal = (props: IAccept) => {
  const { program } = useRecoilValue(sessionStore)

  const acceptHandler = async () => {
    const fs = getRecoil(filesystemStore)
    if (!fs) return

    if (!(await program.fileSystem.hasPublicExchangeKey(fs))) {
      await program.fileSystem.addPublicExchangeKey(fs)
    }

    props.setIsLoading(true)

    try {
      const share = await fs.loadShare({
        shareId: props.shareId,
        sharedBy: props.sharedBy,
      })
      console.log("debug a", share)

      const sharedLinks: SoftLink[] = softLinksOnly(await share.ls([]))

      await fs.write(Data_DIRS[AREAS.SHARED], sharedLinks)
      await fs.publish()

      props.setIsAccept(true)
      props.setIsOpen(false)
    } catch (error) {
      props.setIsLoading(false)
      props.setIsOpen(false)
      throw new Error(error)
    }
  }

  function softLinksOnly(links: Links): SoftLink[] {
    return Object.values(links).reduce((acc: SoftLink[], link: Link) => {
      if (isSoftLink(link)) return [...acc, link]
      return acc
    }, [])
  }

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          open={props.isOpen}
          onClose={() => props.setIsOpen(false)}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white px-8 py-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl md:text-3xl text-center font-bionix"
                  >
                    Accept Sharing
                    <XMarkIcon
                      className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => props.setIsOpen(false)}
                    />
                  </Dialog.Title>
                  <div className="grid grid-cols-12 gap-2 mt-6 mb-6">
                    <div className="col-span-4 sm:col-span-3 content-center">
                      Shared By:{" "}
                    </div>
                    <div className="col-span-8 sm:col-span-9 break-words">
                      {props.sharedBy}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md px-6 py-3 text-sm md:text-base  bg-sky hover:bg-sky-400 hover:text-white ${
                      props.isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={() => acceptHandler()}
                  >
                    {props.isLoading ? "Pending ..." : "Accept"}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AcceptModal
