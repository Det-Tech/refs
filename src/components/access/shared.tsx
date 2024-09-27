"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useRecoilState } from "recoil"
import AcceptModal from "./acceptModal"
import Button from "../common/Button"
import { Spinner } from "../common/Loader"
import { DocumentTextIcon } from "@heroicons/react/24/outline"
import { getFilesFromWNFS, deleteFileFromWNFS } from "@/lib/data"
import { dataStore } from "@/stores/data"
import { AREAS } from "@/stores/data"
import { shortFileName } from "@/utils/handler"

export default function SharedData() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useRecoilState(dataStore)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAccept, setIsAccept] = useState<boolean>(false)
  const shareId = searchParams.get("shareId")
  const sharedBy = searchParams.get("sharedBy")

  useEffect(() => {
    setData({
      ...data,
      selectedArea: AREAS.SHARED,
    })
  }, [])

  useEffect(() => {
    if (shareId === null || sharedBy === null) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [shareId, sharedBy])

  useEffect(() => {
    const loadHandler = async () => {
      if (isAccept) {
        try {
          await getFilesFromWNFS()
          setIsLoading(false)
          router.push("/access")
        } catch (error) {
          setIsLoading(false)
          throw new Error(error)
        }
      }
    }

    loadHandler()
  }, [isAccept])

  useEffect(() => {
    if (shareId === null && sharedBy === null) {
      getFilesFromWNFS()
    }
  }, [shareId, sharedBy])

  const handleDeleteFile = useCallback(async (name: string) => {
    await deleteFileFromWNFS(name)

    getFilesFromWNFS()
  }, [])

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-30">
          <Spinner className="w-16" />
        </div>
      )}
      <div className="flex flex-col p-6">
        <div className="border-2 border-white h-full rounded-lg mt-6 p-6">
          <h2 className="text-xl font-bold uppercase mb-6">Shared Files</h2>
          <div className="flex flex-col gap-4">
            {data.sharedFiles.map((data, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 bg-gray-semiLight rounded-lg p-4"
              >
                <div className="col-span-4 flex items-center gap-2">
                  <div className="pr-2">{index + 1}</div>
                  <DocumentTextIcon className="w-8" />
                  {shortFileName(data.name)}
                </div>
                <div className="col-span-8 flex justify-end items-center">
                  <div className="flex items-center gap-2">
                    <a
                      href={data.src}
                      download={data.name}
                      className=" flex justify-center items-center gap-2 w-full select-none cursor-pointer text-center rounded-md font-lato px-2 py-1 text-sm bg-sky-400 text-white hover:bg-sky-500   "
                    >
                      Download
                    </a>
                    <Button
                      type="black"
                      size="sm"
                      title="Remove"
                      onClick={() => handleDeleteFile(data.name)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <AcceptModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          shareId={shareId}
          sharedBy={sharedBy}
          setIsAccept={setIsAccept}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  )
}
