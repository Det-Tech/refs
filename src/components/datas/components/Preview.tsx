import { Fragment, useState, useCallback, useRef } from "react"
import { Transition } from "@headlessui/react"
import Image from "next/image"
import { useRecoilValue } from "recoil"
import { useReactToPrint } from "react-to-print"
import { XMarkIcon } from "@heroicons/react/20/solid"
import {
  PrinterIcon,
  ShareIcon,
  Square2StackIcon,
  DocumentIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import ShareModal from "../modals/Share"
import HistoryModal from "../modals/History"
import { dataStore } from "@/stores/data"
import { IPreview } from "@/config/interfaces"
import { isImage, isVideo, isPdf } from "@/utils/handler"
import { ipfsGatewayUrl } from "@/config/app-info"
import { getFilesFromWNFS, deleteFileFromWNFS } from "@/lib/data"

const DetailRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="font-semibold">{title}</div>
      <div className="text-gray-500">{value}</div>
    </div>
  )
}

const ButtonRow = ({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  onClick: () => void
}) => {
  return (
    <div
      className="flex items-center gap-4 border border-gray-500 px-4 h-16 cursor-pointer bg-white hover:bg-gray-200"
      onClick={onClick}
    >
      {icon}
      <div className="text-lg leading-6">{title}</div>
    </div>
  )
}

const Preview = (props: IPreview) => {
  const data = useRecoilValue(dataStore)
  const contentRef  = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)

  const closeHandler = () => {
    props.setIsOpen(false)
  }

  const printHandler = () => {
    reactToPrintFn()
  }

  const copyToHandler = () => {}

  const documentHistoryHandler = () => {}

  const deleteHandler = useCallback(
    async (name: string) => {
      await deleteFileFromWNFS(props.paths, name)

      await getFilesFromWNFS(props.paths)

      props.setIsOpen(false)
    },
    [props.paths]
  )

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex flex-col justify-between flex-1 relative">
            <div className="flex flex-col flex-1">
              <h2 className="text-xl font-bold uppercase mb-4">Preview</h2>
              <XMarkIcon
                className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-0 top-0 cursor-pointer"
                aria-hidden="true"
                onClick={() => closeHandler()}
              />
              <div className="flex gap-12 mb-8">
                <div className="flex items-start justify-center w-64 mt-6">
                  <div className="flex flex-col gap-4 justify-center items-center bg-gray-semiLight rounded-md w-full py-6">
                    <DetailRow title="Type of document" value="Sample" />
                    <DetailRow title="Reference" value="Sample" />
                    <DetailRow title="Date" value="Sample" />
                    <DetailRow title="Expirty" value="Sample" />
                    <DetailRow title="File" value="Sample" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center my-4">
                  {isImage(props.data?.name) && (
                    <Image
                      src={props.data?.src}
                      alt="preview"
                      width={500}
                      height={500}
                      className=""
                      ref={contentRef}
                    />
                  )}
                  {isPdf(props.data?.name) && (
                    <iframe
                      src={`https://ipfs.${ipfsGatewayUrl}/ipfs/${props.data?.cid}/userland`}
                      width="400"
                      height="500"
                      className="w-full"
                      ref={contentRef}
                    />
                  )}
                  {isVideo(props.data?.name) && (
                    <video
                      autoPlay
                      muted
                      loop
                      src={`https://ipfs.${ipfsGatewayUrl}/ipfs/${props.data?.cid}/userland`}
                      width="500"
                      height="500"
                    />
                  )}
                  {!isVideo(props.data?.name) &&
                    !isImage(props.data?.name) &&
                    !isPdf(props.data?.name) && (
                      <div className="flex justify-center items-center">
                        <DocumentIcon className="w-64 text-gray-600" />
                      </div>
                    )}
                </div>
                <div className="flex flex-col justify-start mt-6 w-64">
                  <ButtonRow
                    icon={<PrinterIcon className="w-6" />}
                    title="Print"
                    onClick={() => printHandler()}
                  />
                  <ButtonRow
                    icon={<ShareIcon className="w-6" />}
                    title="Share"
                    onClick={() => setIsShareOpen(true)}
                  />
                  <ButtonRow
                    icon={<Square2StackIcon className="w-6" />}
                    title="Copy to..."
                    onClick={() => copyToHandler()}
                  />
                  <ButtonRow
                    icon={<DocumentTextIcon className="w-6" />}
                    title="Document history"
                    onClick={() => setIsHistoryOpen(true)}
                  />
                  <ButtonRow
                    icon={<TrashIcon className="w-6" />}
                    title="Delete"
                    onClick={() => deleteHandler(props.data?.name)}
                  />
                </div>
              </div>
            </div>
            <div className="text-2xl xl:text-3xl text-center">
              {props.data?.name}
            </div>
          </div>
        </Transition.Child>
      </Transition>

      <ShareModal
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
        name={props.data?.name}
      />
      
      <HistoryModal
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
        histories={props.data?.histories}
      />
    </>
  )
}

export default Preview
