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
  name: string
  hashed: string
  fullName: string
  parent_id?: number
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