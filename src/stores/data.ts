import { atom } from "recoil"
import { IContactList } from "@/config/interfaces"
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

const initialContactList: IContactList = {
  tab: "all",
  searchName: "",
  all: [],
  shared: [],
}

export const contactListStore = atom({
  key: "contactList",
  default: initialContactList as IContactList,
  dangerouslyAllowMutability: true,
})
