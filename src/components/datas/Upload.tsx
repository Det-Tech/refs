"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useRecoilState, useRecoilValue } from "recoil"
import { AREAS, dataStore } from "@/stores/data"
import PublicData from "./Public"
import PrivateData from "./Private"
import { getFilesFromWNFS } from "@/lib/data"
import { WifiIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"

const Tab = ({
  isActive,
  icon,
  title,
  changeTab,
}: {
  isActive: boolean
  icon: React.ReactNode
  title: string
  changeTab: (val: string) => void
}) => {
  const router = useRouter()

  return (
    <button
      className={`flex justify-center items-center gap-2 w-full select-none cursor-pointer text-center px-6 py-2 text-lg ${isActive ? "bg-green text-white" : "bg-white text-black"} capitalize`}
      onClick={() => {
        router.push("/datas")
        changeTab(title)
      }}
    >
      <div className="flex items-center w-5 h-5">{icon}</div>
      {title.toLowerCase()}
    </button>
  )
}

export default function DataUpload() {
  const pathName = usePathname()
  const [data, setData] = useRecoilState(dataStore)
  const paths = pathName.split("/").slice(2)

  /**
   * Tab between the public/private areas and load associated images
   * @param area
   */
  const handleChangeTab: (area: AREAS) => void = (area) => {
    setData({
      ...data,
      selectedArea: area,
    })
  }

  useEffect(() => {
    if (paths.length === 0 && data.selectedArea === AREAS.SHARED) {
      setData({
        ...data,
        selectedArea: AREAS.PUBLIC,
      })
    }
  }, [])

  const useMountEffect = () =>
    useEffect(() => {
      getFilesFromWNFS(paths)
    }, [data.selectedArea])

  useMountEffect()

  return (
    <div className="flex flex-col p-6 h-full relative">
      <div className="flex absolute left-16">
        <div className="flex items-center rounded-md overflow-hidden">
          <Tab
            isActive={data.selectedArea === AREAS.PUBLIC}
            icon={<CloudArrowUpIcon />}
            title={AREAS.PUBLIC}
            changeTab={handleChangeTab}
          />
          <Tab
            isActive={data.selectedArea === AREAS.PRIVATE}
            icon={<WifiIcon />}
            title={AREAS.PRIVATE}
            changeTab={handleChangeTab}
          />
        </div>
      </div>
      <div className="border-2 border-white h-full rounded-lg mt-6 p-6 pt-12">
        {data.selectedArea === AREAS.PUBLIC ? (
          <PublicData paths={paths} />
        ) : (
          <PrivateData paths={paths} />
        )}
      </div>
    </div>
  )
}
