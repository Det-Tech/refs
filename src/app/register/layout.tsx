import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register | Etherland",
  description: "Register | Etherland",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 bg-gradient-to-b from-green to-green-800 h-full">
      {children}
    </div>
  )
}
