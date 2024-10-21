import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datas | Etherland",
  description: "Datas | Etherland",
}

export default function DatasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1 bg-gray-light">{children}</div>
}
