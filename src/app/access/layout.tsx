import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Access | Etherland",
  description: "Access | Etherland",
}

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1 bg-gray-light">{children}</div>
}
