import { Product } from "@/lib/data"

export interface IMenu {
  icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
  title: string
  link: string
}

export interface IFile {
  file: File | null
  type: string
  document: string
  name: string
  expirty: string
}

export interface IUser {
  id: number
  name: string
  hashed: string
  fullName: string
  parent_id?: number
  sharedList?: string
}

export interface IShare {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  name: string
}

export interface IAlert {
  open: boolean
  message: React.ReactNode | undefined
  severity: string | undefined
}

export interface IPreview {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  data: Product
}

export interface IConnectDevice {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  qrCode: string
  connectedLink: string
}

export interface IDelegateAccount {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  pinInput: string
  setPinInput: (val: string) => void
  pinError: boolean
  setPinError: (val: boolean) => void
  cancelConnection: () => void
  checkPin: () => void
}

export type ContactListTab = "all" | "shared"
export interface IContactList {
  tab: ContactListTab
  searchName: string
  all: IUser[]
  shared: IUser[]
}
