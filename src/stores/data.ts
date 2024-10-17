import { atom } from "recoil"

import { type Data } from "@/lib/data"

export enum AREAS {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SHARED = "SHARED",
}

const initialData: Data = {
  loading: true,
  public: {
    files: [],
    folders: [],
  },
  private: {
    files: [],
    folders: [],
  },
  shared: {
    files: [],
    folders: [],
  },
  selectedArea: AREAS.PUBLIC,
}

export const dataStore = atom({
  key: "data",
  default: initialData as Data,
  dangerouslyAllowMutability: true,
})
