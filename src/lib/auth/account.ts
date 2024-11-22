import * as uint8arrays from "uint8arrays"
import type FileSystem from "@etherland/odd/fs/index"
import { sha256 } from "@etherland/odd/components/crypto/implementation/browser"
import { publicKeyToDid } from "@etherland/odd/did/transformers"
import type { Crypto } from "@etherland/odd"
import { getRecoil, setRecoil } from "recoil-nexus"

import { filesystemStore, sessionStore } from "../../stores/system"
import { AREAS } from "@/stores/data"
import { Data_DIRS } from "@/lib/data"
import { ACCOUNT_SETTINGS_DIR } from "../account-settings"
import { asyncDebounce } from "../utils"
import { getBackupStatus } from "./backup"

export const USERNAME_STORAGE_KEY = "fullUsername"

export enum RECOVERY_STATES {
  Ready,
  Processing,
  Error,
  Done,
}

export const isUsernameValid = async (username: string): Promise<boolean> => {
  const session = getRecoil(sessionStore)
  return (
    session.authStrategy !== null &&
    session.authStrategy.isUsernameValid(username)
  )
}

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const session = getRecoil(sessionStore);
  console.log("refs isUsernameAvailable ...")
  return (
    session.authStrategy !== null &&
    session.authStrategy.isUsernameAvailable(username)
  )
}

export const debouncedIsUsernameAvailable = asyncDebounce(
  isUsernameAvailable,
  300
)

/**
 * Create additional directories and files needed by the app
 *
 * @param fs FileSystem
 */
const initializeFilesystem = async (fs: FileSystem): Promise<void> => {
  await fs.mkdir(Data_DIRS[AREAS.PUBLIC])
  await fs.mkdir(Data_DIRS[AREAS.PRIVATE])
  await fs.mkdir(ACCOUNT_SETTINGS_DIR)
}

export const createDID = async (
  crypto: Crypto.Implementation
): Promise<string> => {
  const pubKey = await crypto.keystore.publicExchangeKey()
  const ksAlg = await crypto.keystore.getAlgorithm()

  return publicKeyToDid(crypto, pubKey, ksAlg)
}

export const prepareUsername = async (username: string): Promise<string> => {
  const normalizedUsername = username.normalize("NFD")
  const hashedUsername = await sha256(
    new TextEncoder().encode(normalizedUsername)
  )

  return uint8arrays.toString(hashedUsername, "base32").slice(0, 32)
}

// export const emailVerify =async (email:string) => {
//   const originalSession = getRecoil(sessionStore)
//   const {
//     authStrategy,
//     program: {
//       components: { storage },
//     },
//   } = originalSession
//   const { success } = await authStrategy
  
// }

interface register {
  hashedUsername: string;
  username: string;
  email: string;
  code: string;
}

export const register = async ( data: register): Promise<boolean> => {
  const originalSession = getRecoil(sessionStore)
  const {
    authStrategy,
    program: {
      components: { storage },
    },
  } = originalSession
  console.log("register start.....")
  const { success } = await authStrategy.register(data)
  console.log("register success.....", success)
  if (!success) return success

  console.log("session start.....** ")
  const session = await authStrategy.session()

  console.log("session success.....", success)

  setRecoil(filesystemStore, session?.fs || null)

  console.log("initializeFilesystem start.....")
  // TODO Remove if only public and private directories are needed
  await initializeFilesystem(session?.fs as FileSystem)
  console.log("initializeFilesystem success.....")

  const fullUsername = (await storage.getItem(USERNAME_STORAGE_KEY)) as string

  let user = null
  try {
    const userInfo = await fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullUsername.split("#")[0],
        hashed: data.hashedUsername,
        fullName: fullUsername,
      }),
    })
    user = await userInfo.json()
  } catch (error) {
    throw new Error(error)
  }

  setRecoil(sessionStore, {
    ...originalSession,
    userInfo: {
      id: user !== null ? user.id : 0,
      sharedList:
        user !== null
          ? user.sharedList !== null
            ? user.sharedList.split(",")
            : []
          : [],
      full: fullUsername,
      hashed: data.hashedUsername,
      trimmed: fullUsername.split("#")[0],
    },
    session,
  })

  return success
}

export const loadAccount = async (
  hashedUsername: string,
  fullUsername: string
): Promise<void> => {
  const originalSession = getRecoil(sessionStore)
  const {
    authStrategy,
    program: {
      components: { storage },
    },
  } = originalSession

  const session = await authStrategy.session()

  setRecoil(filesystemStore, session?.fs || null)

  const backupStatus = await getBackupStatus(session?.fs as FileSystem)

  await storage.setItem(USERNAME_STORAGE_KEY, fullUsername)

  let user = null
  try {
    const userInfo = await fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullUsername.split("#")[0],
        hashed: hashedUsername,
        fullName: fullUsername,
      }),
    })
    user = await userInfo.json()
  } catch (error) {
    throw new Error(error)
  }

  setRecoil(sessionStore, {
    ...originalSession,
    userInfo: {
      id: user !== null ? user.id : 0,
      sharedList:
        user !== null
          ? user.sharedList !== null
            ? user.sharedList.split(",")
            : []
          : [],
      full: fullUsername,
      hashed: hashedUsername,
      trimmed: fullUsername.split("#")[0],
    },
    session,
    backupCreated: !!backupStatus?.created,
  })
}
