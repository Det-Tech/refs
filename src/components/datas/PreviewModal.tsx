import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { useRecoilValue } from "recoil"
import { XMarkIcon } from "@heroicons/react/20/solid"
import {
  CloudArrowDownIcon,
  ShareIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline"
import Button from "../common/Button"
import { AREAS, dataStore } from "@/stores/data"
import { IPreview } from "@/config/interfaces"
import { isImage, isVideo, isPdf } from "@/utils/handler"
import { ipfsGatewayUrl } from "@/config/app-info"
import "react-toastify/dist/ReactToastify.css"

const PreviewModal = (props: IPreview) => {
  const data = useRecoilValue(dataStore)

  const closeHandler = () => {
    props.setIsOpen(false)
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
                <Dialog.Panel className="w-full max-w-sm md:max-w-md transform overflow-hidden rounded-xl bg-white px-8 py-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl md:text-3xl text-center font-bionix break-all"
                  >
                    {props.data?.name}
                    <XMarkIcon
                      className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => closeHandler()}
                    />
                  </Dialog.Title>
                  <div className="flex justify-center items-center my-4">
                    {isImage(props.data?.name) && (
                      <Image
                        src={props.data?.src}
                        alt="preview"
                        width={350}
                        height={350}
                        className="p-2 rounded-md border border-gray-300"
                      />
                    )}
                    {isPdf(props.data?.name) && (
                      <iframe
                        src={`https://ipfs.${ipfsGatewayUrl}/ipfs/${props.data?.cid}/userland`}
                        width="400"
                        height="400"
                        className="border border-gray-300 p-1 rounded-md"
                      />
                    )}
                    {isVideo(props.data?.name) && (
                      <video
                        autoPlay
                        muted
                        loop
                        src={`https://ipfs.${ipfsGatewayUrl}/ipfs/${props.data?.cid}/userland`}
                        width="400"
                        height="400"
                        className="border border-gray-300 p-1 rounded-md"
                      />
                    )}
                    {!isVideo(props.data?.name) &&
                      !isImage(props.data?.name) &&
                      !isPdf(props.data?.name) && (
                        <div className="flex justify-center items-center">
                          <DocumentIcon className="w-44 text-gray-600" />
                        </div>
                      )}
                  </div>
                  {data.selectedArea === AREAS.PUBLIC && (
                    <div className="flex justify-center">
                      <a
                        href={`https://ipfs.${ipfsGatewayUrl}/ipfs/${props.data?.cid}/userland`}
                        className="border-b border-gray-600 opacity-70 hover:opacity-100"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on IPFS
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between gap-6 mt-6">
                    <Button
                      type="orange"
                      size="md"
                      title="Download"
                      LeftIcon={<CloudArrowDownIcon />}
                    />
                    <Button
                      type="sky"
                      size="md"
                      title="Share"
                      LeftIcon={<ShareIcon />}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default PreviewModal
