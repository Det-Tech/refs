import Link from "next/link"
import { HomeIcon } from "@heroicons/react/20/solid"

export default function NotFound() {
  return (
    <div className="flex-1 bg-gradient-to-b from-green to-green-800 min-h-screen">
      <div className="w-full text-center mt-16 sm:mt-44">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-widest pt-16 text-white">
          Page Not Found
        </h1>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sky hover:text-sky-400 text-xl sm:text-2xl uppercase tracking-widest border-b border-sky hover:border-sky-400"
          >
            <HomeIcon className="w-6 h-6"/>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
