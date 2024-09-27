import { useState } from "react"
import { useRecoilValue } from "recoil"
import Button from "@/components/common/Button"
import Backup from "./Backup"
import { appName } from "@/config/app-info"
import { sessionStore } from "@/stores/system"
import { CheckCircleIcon } from "@heroicons/react/20/solid"

const Welcome = () => {
  const session = useRecoilValue(sessionStore)
  const [isContinue, setIsContinue] = useState<boolean>(false)

  if (isContinue) {
    return <Backup />
  }

  return (
    <div className="mt-16 sm:mt-44 px-4 sm:px-0">
      <div className="flex flex-col gap-6 w-full sm:w-96 mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6 text-white">
        <div>
          <h3 className="mb-6 text-4xl font-bold text-center">
            Welcome, {session.username?.trimmed}!
          </h3>
          <div className="flex justify-center mb-4 text-base-content">
            <CheckCircleIcon className="w-32 h-32" />
          </div>
          <div>
            <p className="mb-4 text-center">Your account has been created.</p>

            <div className="mb-8 text-center">
              <input
                type="checkbox"
                id="password-message"
                className="peer hidden"
              />
              <label
                className="text-blue-500 underline mb-8 hover:cursor-pointer peer-checked:hidden"
                htmlFor="password-message"
              >
                Wait&mdash;what&#39;s my password?
              </label>
              <p className="hidden peer-checked:block">
                You don&#39;t need a password! <br />
                {appName} uses public key cryptography to authenticate you with
                this device.
              </p>
            </div>

            <Button
              className="py-3"
              type="orange"
              title="Continue"
              onClick={() => setIsContinue(true)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
