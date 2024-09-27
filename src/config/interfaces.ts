export interface IMenu {
  icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>
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