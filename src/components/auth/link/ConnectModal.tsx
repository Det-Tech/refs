import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { toast } from "react-toastify"
import clipboardCopy from "clipboard-copy"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { ShareIcon } from "@heroicons/react/24/outline"
import Button from "../../common/Button"
import { IConnectDevice } from "@/config/interfaces"

const ConnectModal = (props: IConnectDevice) => {
  const closeHandler = () => {
    props.setIsOpen(false)
  }

  const handleCopyLink = async () => {
    await clipboardCopy(props.connectedLink)
    toast.success("Copied")
  }

  return (
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
                  Connect a backup device
                  <XMarkIcon
                    className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                    aria-hidden="true"
                    onClick={() => closeHandler()}
                  />
                </Dialog.Title>
                {props.qrCode !== "" && (
                  <div className="flex flex-col items-center justify-center gap-4 mb-7 rounded-lg overflow-hidden mt-6">
                    <div dangerouslySetInnerHTML={{ __html: props.qrCode }} />
                    <div className="text-center">
                      Scan this code on your phone, or share the connection
                      link.
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    type="sky"
                    title="Share connection link"
                    LeftIcon={<ShareIcon className="w-4" />}
                    onClick={() => handleCopyLink()}
                  />
                  <Button
                    type="black"
                    title="Close"
                    onClick={() => closeHandler()}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConnectModal
