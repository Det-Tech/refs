import type * as odd from "@etherland/odd"

import { appName } from "../config/app-info"

type USERINFO = {
  id: number
  sharedList: string[]
  full: string
  hashed: string
  trimmed: string
}

export type SESSION = {
  userInfo: USERINFO
  session: odd.Session | null
  authStrategy: odd.AuthenticationStrategy | null
  program: odd.Program
  loading: boolean
  backupCreated: boolean
  error?: SESSION_ERROR
}

export enum SESSION_ERROR {
  INSECURE_CONTEXT = "Insecure Context",
  UNSUPORTED_CONTEXT = "Unsupported Browser",
}

export type SESSION_STORE = {
  session: SESSION
  updateSession: (session: SESSION) => void
}

export const errorToMessage = (error: SESSION_ERROR): string => {
  switch (error) {
    case SESSION_ERROR.INSECURE_CONTEXT:
      return `${appName} requires a secure context (HTTPS)`

    case SESSION_ERROR.UNSUPORTED_CONTEXT:
      return `Your browser does not support ${appName}`
  }
}

export const initialSession: SESSION = {
  userInfo: null,
  session: null,
  authStrategy: null,
  program: null,
  loading: true,
  backupCreated: false,
}
