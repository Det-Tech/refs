import Link from "next/link"
import { useRecoilValue } from "recoil"
import { HomeIcon } from "@heroicons/react/24/outline"
import { dataStore } from "@/stores/data"

export default function Nav({ paths }: { paths: string[] }) {
  const datas = useRecoilValue(dataStore)

  return (
    <div className="flex justify-start items-center gap-2 select-none">
      <Link href="/datas" className={`flex items-center gap-1 capitalize ${paths.length > 0 ? "text-gray-600" : "text-black"}  hover:text-black`}>
        <HomeIcon className="w-4" /> {datas.selectedArea.toLowerCase()}
      </Link>
      {paths.map((path: string, index: number) => {
        return (
          <div className="flex items-center gap-2" key={index}>
            <div>/</div>
            {index < paths.length - 1 ? (
              <Link href={`/datas/${paths.slice(0, index + 1).join("/")}`} className="text-gray-600 hover:text-black capitalize">{path.toLowerCase()}</Link>
            ) : (
              <span className="capitalize">{path.toLowerCase()}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
