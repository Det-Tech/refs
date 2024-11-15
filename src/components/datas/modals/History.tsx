import { Fragment, useCallback } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { IHistory, IHistoryModal } from "@/config/interfaces"

const HistoryModal = (props: IHistoryModal) => {
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
                <Dialog.Panel className="w-full max-w-md md:max-w-xl transform rounded-xl bg-white px-8 py-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl md:text-4xl text-center font-bionix"
                  >
                    Document Histories
                    <XMarkIcon
                      className="h-7 w-7 text-gray-dark hover:text-black-light absolute right-4 top-3 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => props.setIsOpen(false)}
                    />
                  </Dialog.Title>
                  <div>
                    {props.histories.length === 0 ? (
                      <div>There is no history</div>
                    ) : (
                      props.histories.map(
                        (history: IHistory, index: number) => (
                          <div key={index} className="">
                            <div>{index}</div>
                            <div>{history.timestamp}</div>
                          </div>
                        )
                      )
                    )}
                  </div>
                  <div className="flex font-lato mt-8">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md px-6 py-2 text-sm md:text-base bg-transparent hover:bg-black-semiLight border-black border`}
                      onClick={() => props.setIsOpen(false)}
                    >
                      Close
                    </button>
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

export default HistoryModal
