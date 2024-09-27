import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setting | Etherland",
  description: "Setting | Etherland",
}

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1 bg-gray-light">{children}</div>
}
