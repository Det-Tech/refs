import { FormEvent, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import Link from "next/link"
import { sessionStore } from "@/stores/system"
import Button from "@/components/common/Button"
import LinkButton from "@/components/common/LinkButton"
import {
  createDID,
  prepareUsername,
  register,
  USERNAME_STORAGE_KEY,
} from "@/lib/auth/account"
import FilesystemActivity from "@/components/common/FilesystemActivity"

const Register = () => {
  const {
    program: {
      components: { crypto, storage },
    },
  } = useRecoilValue(sessionStore)

  const [initializingFilesystem, setInitializingFilesystem] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(true)
  const [username, setUsername] = useState("")
  const [encodedUsername, setEncodedUsername] = useState("")
  const [usernameValid] = useState(true)
  const [usernameAvailable] = useState(true)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [existingAccount, setExistingAccount] = useState(false)

  const [buttonDisabled, setButtonDisabled] = useState(
    username.length === 0 ||
      !usernameValid ||
      !usernameAvailable ||
      checkingUsername
  )

  const handleCheckUsername = async (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement

    setUsername(value)
    setCheckingUsername(true)

    /**
     * Create a new DID for the user, which will be appended to their username, concatenated
     * via a `#`, hashed and encoded to ensure uniqueness
     */
    const did = await createDID(crypto)
    const fullUsername = `${value}#${did}`
    await storage.setItem(USERNAME_STORAGE_KEY, fullUsername)

    const encodedUsernameLocal = await prepareUsername(fullUsername)
    setEncodedUsername(encodedUsernameLocal)

    setCheckingUsername(false)
  }

  const handleRegisterUser = async () => {
    if (checkingUsername) {
      return
    }

    setInitializingFilesystem(true)

    const registrationSuccessLocal = await register(encodedUsername)
    setRegistrationSuccess(registrationSuccessLocal)

    if (!registrationSuccessLocal) setInitializingFilesystem(false)
  }

  useEffect(() => {
    setButtonDisabled(
      username.length === 0 ||
        !usernameValid ||
        !usernameAvailable ||
        checkingUsername
    )
  }, [username, usernameValid, usernameAvailable, checkingUsername])

  if (initializingFilesystem) {
    return <FilesystemActivity activity="Initializing" />
  }

  return (
    <div className="mt-44">
      <h1 className="text-4xl text-center font-bold text-white">
        Connect this device
      </h1>
      <div className="flex flex-col gap-6 w-96 mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6 text-white">
        {/* Registration Form */}
        <div className="w-full">
          <h2 className="mb-2 font-semibold">Choose a username</h2>
          <div className="relative">
            <input
              id="registration"
              type="text"
              placeholder="Type here"
              className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-md focus:outline-none w-full px-4 py-3 block ${
                !(username.length === 0) &&
                usernameAvailable &&
                usernameValid &&
                !checkingUsername
                  ? "!border-green-300"
                  : ""
              } ${
                username.length !== 0 && (!usernameValid || !usernameAvailable)
                  ? "!border-red-400"
                  : ""
              }`}
              onInput={handleCheckUsername}
            />
            {checkingUsername && (
              <span className="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 block absolute top-4 right-4 animate-spin" />
            )}
          </div>

          {!registrationSuccess && (
            // Error when registration fails
            <label htmlFor="registration" className="label">
              <span className="text-xxs !p-0 text-error text-left">
                There was an issue registering your account. Please try again.
              </span>
            </label>
          )}

          <div className="text-left mt-4">
            <input
              type="checkbox"
              id="shared-computer"
              className="peer w-4 h-4 translate-y-0.5 mr-1"
            />
            {/* Warning when "This is a shared computer" is checked */}
            <label
              htmlFor="shared-computer"
              className="cursor-pointer ml-1 text-sm grid-inline"
            >
              This is a public or shared computer
            </label>
            <label
              htmlFor="registration"
              className="label mt-4 !p-0 hidden peer-checked:block"
            >
              <span className="text-red-400 text-left text-sm">
                In order to ensure the security of your private data, the ODD
                SDK does not recommend creating an account from a public or
                shared computer.
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <LinkButton
              className="py-3"
              link="/"
              type="trans"
              title="Cancel"
              isSelf={true}
            />
            <Button
              className="py-3"
              isDisable={buttonDisabled}
              type="sky"
              title="Create your account"
              onClick={() => handleRegisterUser()}
            />
          </div>
        </div>
        {/* Existing Account */}
        <div className="flex flex-col gap-5 w-full">
          <Button
            className="py-3"
            onClick={() => setExistingAccount(!existingAccount)}
            title="I have an existing account"
            type="orange"
          />
          {existingAccount && (
            <div className="flex flex-col gap-3 p-6 rounded bg-neutral-200 text-neutral-900 text-sm">
              <h3 className="font-bold text-center">
                Which device are you connected on?
              </h3>
              <p>To connect your existing account, you&apos;ll need to:</p>
              <ol className="pl-6 list-decimal">
                <li>Find a device the account is already connected on</li>
                <li>Navigate to your Account Settings</li>
                <li>Click &ldquo;Connect a new device&rdquo;</li>
              </ol>
            </div>
          )}
        </div>

        {/* Recovery Link */}
        <Link href="/recover" className="underline text-center">
          Recover an account
        </Link>
      </div>
    </div>
  )
}

export default Register
