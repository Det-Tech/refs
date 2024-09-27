import type { Metadata } from "next"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { Inter } from "next/font/google"
import RecoilContextProvider from "@/lib/RecoilContextProvider"
import "@/assets/styles/globals.css"
import dynamic from "next/dynamic"

const InitProvider = dynamic(() => import("@/lib/InitProvider"), {
  ssr: false,
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Etherland",
  description: "Etherland REFS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>
          <InitProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                {children}
              </div>
            </div>
          </InitProvider>
        </RecoilContextProvider>
      </body>
    </html>
  )
}
