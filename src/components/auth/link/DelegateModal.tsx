import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { toast } from "react-toastify"
import clipboardCopy from "clipboard-copy"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { ShareIcon } from "@heroicons/react/24/outline"
import Button from "../../common/Button"
import { IDelegateAccount } from "@/config/interfaces"
import "react-toastify/dist/ReactToastify.css"

const DelegateModal = (props: IDelegateAccount) => {
  const closeHandler = () => {
    props.setIsOpen(false)
  }

  const TARGET_PIN_LENGTH = 6

  const handleCheckPin = () => {
    if (props.pinInput.length === TARGET_PIN_LENGTH) {
      props.checkPin()
    } else {
      props.setPinError(false)
    }
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
                  className="text-2xl md:text-2xl text-center font-bionix break-all"
                >
                  A new device would like to connect to your account
                  <XMarkIcon
                    className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                    aria-hidden="true"
                    onClick={() => closeHandler()}
                  />
                </Dialog.Title>
                <div className="flex flex-col my-6">
                  <input
                    id="pin"
                    type="text"
                    className={`border border-gray-400 w-full mb-2 rounded-full focus:outline-none text-4xl py-2 text-center tracking-[0.1em] font-bold ${
                      props.pinError ? "!text-red-400 !border-red-400" : ""
                    }`}
                    maxLength={6}
                    value={props.pinInput}
                    onChange={(e) => props.setPinInput(e.target.value)}
                    onKeyUp={() => handleCheckPin()}
                  />
                  <label htmlFor="pin" className="text-center">
                    {!props.pinError ? (
                      <span className="">
                        Enter the connection code from that device to approve
                        this connection.
                      </span>
                    ) : (
                      <span className="text-red-400">
                        Entered pin does not match a pin from a known device.
                      </span>
                    )}
                  </label>
                </div>
                <div className="flex flex-col gap-2">
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

export default DelegateModal
