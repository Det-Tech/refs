import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Properties | Etherland",
  description: "Properties | Etherland",
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1 bg-gray-light">{children}</div>
}
