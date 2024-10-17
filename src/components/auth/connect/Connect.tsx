import Image from "next/image"
import LinkButton from "@/components/common/LinkButton"
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/20/solid"

export default function Connect() {
  return (
    <div className="flex-1 bg-gradient-to-b from-green to-green-800 h-full">
      <div className="mt-44">
        <div className="flex justify-center items-center gap-6">
          <Image src="/images/logo.png" alt="logo" width={60} height={60} />
          <span className="text-7xl font-bold text-white">Etherland</span>
        </div>
        <div className="text-center text-white text-3xl font-bold -translate-y-2">
          REFS
        </div>
        <div className=" flex flex-col gap-6 w-96 mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6">
          <LinkButton
            className="py-3"
            type="orange"
            size="md"
            link="/register"
            title="Connect this device"
            isSelf={true}
            LeftIcon={<ArrowLeftEndOnRectangleIcon className="w-5 h-5" />}
          />
          <LinkButton
            type="sky"
            className="py-3"
            size="md"
            link="/recover"
            isSelf={true}
            title="Recover an existing account"
          />
        </div>
      </div>
    </div>
  )
}
