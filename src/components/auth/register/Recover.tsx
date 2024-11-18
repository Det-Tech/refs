"use client"

import { useState } from "react"
import { useRecoilValue } from "recoil"
import Link from "next/link"
import RecoveryKitButton from "./RecoveryKitButton"
import * as uint8arrays from "uint8arrays"
import * as RootKey from "@etherland/odd/common/root-key"
import * as UCAN from "@etherland/odd/ucan/index"
import { sessionStore } from "@/stores/system"
import {
  prepareUsername,
  loadAccount,
  USERNAME_STORAGE_KEY,
  RECOVERY_STATES,
} from "@/lib/auth/account"
import { CheckIcon } from "@heroicons/react/24/outline"

const Recover = () => {
  const session = useRecoilValue(sessionStore)

  const [state, setState] = useState<RECOVERY_STATES>(
    session.session ? RECOVERY_STATES.Done : RECOVERY_STATES.Ready
  )

  /**
   * Parse the user's `username` and `readKey` from the uploaded recovery kit and pass them into
   * odd to recover the user's account and populate the `session` and `filesystem` stores
   * @param files
   */
  const handleFileInput: (files: FileList) => Promise<void> = async (files) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      setState(RECOVERY_STATES.Processing)
      try {
        const {
          authStrategy,
          program: {
            components: { crypto, reference, storage },
          },
        } = session

        // const parts = (event.target.result as string)
        //   .split("username: ")[1]
        //   .split("key: ")
        // const readKey = uint8arrays.fromString(
        //   parts[1].replace(/(\r\n|\n|\r)/gm, ""),
        //   "base64pad"
        // )

        // const oldUsername = parts[0].replace(/(\r\n|\n|\r)/gm, "")
        // const hashedOldUsername = await prepareUsername(oldUsername)
        // const newRootDID = await session.program.agentDID()

        // // Construct a new username using the old `trimmed` name and `newRootDID`
        // const newUsername = `${oldUsername.split("#")[0]}#${newRootDID}`
        // const hashedNewUsername = await prepareUsername(newUsername)

        // storage.setItem(USERNAME_STORAGE_KEY, newUsername)

        // // Register the user with the `hashedNewUsername`
        // const { success } = await authStrategy.register({
        //   username: hashedNewUsername,
        //   // code: hashedNewUsername,
        //   email: hashedNewUsername,
        //   // hashedUsername: hashedNewUsername
        // })
        // if (!success) {
        //   throw new Error("Failed to register new user")
        // }

        // // Build an ephemeral UCAN to allow the
        // const proof: string | null = await storage.getItem(
        //   storage.KEYS.ACCOUNT_UCAN
        // )
        // const ucan = await UCAN.build({
        //   dependencies: session.program.components,
        //   potency: "APPEND",
        //   resource: "*",
        //   proof: proof ? proof : undefined,
        //   lifetimeInSeconds: 60 * 3, // Three minutes
        //   audience: newRootDID,
        //   issuer: newRootDID,
        // })

        // const oldRootCID = await reference.dataRoot.lookup(hashedOldUsername)

        // // Update the dataRoot of the new user
        // await reference.dataRoot.update(oldRootCID, ucan)

        // // Store the accountDID and readKey in odd so they can be used internally load the file system
        // await RootKey.store({
        //   accountDID: newRootDID,
        //   readKey,
        //   crypto: crypto,
        // })

        // // Load account data into sessionStore
        // await loadAccount(hashedNewUsername, newUsername)

        setState(RECOVERY_STATES.Done)
      } catch (error) {
        console.error(error)
        setState(RECOVERY_STATES.Error)
      }
    }
    reader.onerror = (error) => {
      console.error(error)
      setState(RECOVERY_STATES.Error)
    }
    reader.readAsText(files[0])
  }

  return (
    <div className="mt-44">
      <h1 className="text-4xl text-center font-bold text-white">
        Recover your account
      </h1>
      <div className="flex flex-col gap-6 w-96 mx-auto bg-black-light bg-opacity-80 rounded-xl px-8 py-10 mt-6 text-white text-center">
        {state === RECOVERY_STATES.Done ? (
          <>
            <h3 className="flex justify-center items-center gap-2 font-normal text-base text-green-600">
              <CheckIcon className="w-5" /> Account recovered!
            </h3>
            <p>
              Welcome back <strong>{session.userInfo.trimmed}.</strong>
              <br />
              We were able to successfully recover all of your private data.
            </p>
          </>
        ) : (
          <p>
            If you’ve lost access to all of your connected devices, you can use
            your recovery kit to restore access to your private data.
          </p>
        )}

        {state === RECOVERY_STATES.Error && (
          <p className="text-red-600">
            We were unable to recover your account. Please double check that you
            uploaded the correct file.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <RecoveryKitButton handleFileInput={handleFileInput} state={state} />

          {state !== RECOVERY_STATES.Done && (
            <p className="text-sm mt-1 text-center opacity-80">
              {`It should be a file named Etherland-RecoveryKit-{yourUsername}.txt`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recover
