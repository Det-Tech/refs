import { atom } from "recoil"

import { type Data } from "@/lib/data"

export enum AREAS {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SHARED = "SHARED",
}

const initialData: Data = {
  loading: true,
  publicFiles: [],
  privateFiles: [],
  sharedFiles: [],
  selectedArea: AREAS.PUBLIC,
}

export const dataStore = atom({
  key: "data",
  default: initialData as Data,
  dangerouslyAllowMutability: true,
})
