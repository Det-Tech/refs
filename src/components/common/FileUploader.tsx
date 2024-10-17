import { useState, useCallback } from "react"
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import Button from "./Button"
import Input from "../datas/Input"
import { Spinner } from "./Loader"
import { getFilesFromWNFS, uploadFileToWNFS } from "@/lib/data"
import { shortFileName } from "@/utils/handler"
import { IFile } from "@/config/interfaces"
import { type Data } from "@/lib/data"

export default function FileUploader({
  datas,
  setOpenFileUpload,
  paths,
}: {
  datas: Data
  setOpenFileUpload: (val: boolean) => void
  paths: string[]
}) {
  const [info, setInfo] = useState<IFile>({
    file: null,
    type: "",
    document: "",
    name: "",
    expirty: "",
  })

  const handleFileInput = (val: File | null) => {
    if (val === null || val === undefined) return

    setInfo((prev) => {
      return {
        ...prev,
        file: val,
      }
    })
  }

  const handleDataInput = useCallback((name: string, val: string) => {
    setInfo((prev) => {
      return {
        ...prev,
        [name]: val,
      }
    })
  }, [])

  const handleUpdateFile = useCallback(async () => {
    if (info.file === null || datas.loading) return

    await uploadFileToWNFS(paths, info.file)

    getFilesFromWNFS(paths)

    setInfo({
      file: null,
      type: "",
      document: "",
      name: "",
      expirty: "",
    })
  }, [paths, info.file, datas])

  return (
    <div className="border-b border-white pb-8 mb-8">
      <h2 className="text-xl font-bold uppercase mb-4">File Upload</h2>
      <div className="relative flex justify-between items-center gap-6  bg-gray-semiLight px-16 py-6 rounded-md">
        <XMarkIcon
          className="w-6 absolute right-4 top-4 opacity-70 cursor-pointer hover:opacity-90"
          onClick={() => setOpenFileUpload(false)}
        />
        <div className="flex gap-16">
          <label
            htmlFor="file-upload"
            className="flex flex-col justify-center items-center select-none bg-white cursor-pointer px-12 rounded-xl active:scale-95 active:border-gray-light border-2"
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleFileInput(e.target.files[0])}
            />
            <DocumentTextIcon className="w-16" />
            <div className="mt-2">
              {info.file === null
                ? "Import a file"
                : shortFileName(info.file.name)}
            </div>
          </label>
          <div className="flex flex-col gap-4 select-none">
            <Input
              type="text"
              name="type"
              placeholder="File"
              val={info.type}
              setVal={(name, val) => handleDataInput(name, val)}
            />
            <Input
              type="text"
              name="document"
              placeholder="Type of document"
              val={info.document}
              setVal={(name, val) => handleDataInput(name, val)}
            />
            <Input
              type="text"
              name="name"
              placeholder="Document name"
              val={info.name}
              setVal={(name, val) => handleDataInput(name, val)}
            />
            <Input
              type="text"
              name="expirty"
              placeholder="Expirty"
              val={info.expirty}
              setVal={(name, val) => handleDataInput(name, val)}
            />
          </div>
        </div>
        <div>
          <Button
            type="orange"
            size="md"
            title={datas.loading ? "Uploading..." : "Upload"}
            LeftIcon={
              datas.loading ? <Spinner className="w-5" /> : <CloudArrowUpIcon />
            }
            onClick={() => handleUpdateFile()}
            isDisable={datas.loading || info.file === null}
          />
        </div>
      </div>
    </div>
  )
}
