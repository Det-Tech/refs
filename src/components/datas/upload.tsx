"use client"

import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { AREAS, dataStore } from "@/stores/data"
import PublicData from "./public"
import PrivateData from "./private"
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
  return (
    <button
      className={`flex justify-center items-center gap-2 w-full cursor-pointer text-center px-6 py-2 text-lg ${isActive ? "bg-green text-white" : "bg-white text-black"} capitalize`}
      onClick={() => changeTab(title)}
    >
      <div className="flex items-center w-5 h-5">{icon}</div>
      {title.toLowerCase()}
    </button>
  )
}

export default function DataUpload() {
  const [data, setData] = useRecoilState(dataStore)

  /**
   * Tab between the public/private areas and load associated images
   * @param area
   */
  const handleChangeTab: (area: AREAS) => void = (area) =>
    setData({
      ...data,
      selectedArea: area,
    })

  useEffect(() => {
    setData({
      ...data,
      selectedArea: AREAS.PUBLIC,
    })
  }, [])

  const useMountEffect = () =>
    useEffect(() => {
      getFilesFromWNFS()
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
        {data.selectedArea === AREAS.PUBLIC ? <PublicData /> : <PrivateData />}
      </div>
    </div>
  )
}
