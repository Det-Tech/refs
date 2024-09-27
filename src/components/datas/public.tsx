import { useCallback, useState, useEffect } from "react"
import { DocumentTextIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { useRecoilValue } from "recoil"
import Button from "../common/Button"
import LinkButton from "../common/LinkButton"
import Input from "./Input"
import { Spinner } from "../common/Loader"
import {
  getFilesFromWNFS,
  uploadFileToWNFS,
  deleteFileFromWNFS,
} from "@/lib/data"
import { shortFileName } from "@/utils/handler"
import { ipfsGatewayUrl } from "@/config/app-info"
import { dataStore } from "@/stores/data"
import { IFile } from "@/config/interfaces"

export default function PublicData() {
  const datas = useRecoilValue(dataStore)

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

    await uploadFileToWNFS(info.file)

    getFilesFromWNFS()
  }, [info.file, datas])

  const handleDeleteFile = useCallback(async (name: string) => {
    await deleteFileFromWNFS(name)

    getFilesFromWNFS()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold uppercase mb-4">File Upload</h2>
      <div className="flex justify-between items-center gap-6  bg-gray-semiLight px-16 py-6 rounded-md">
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
      <div className="border-t border-white pt-8 mt-12">
        <h2 className="text-xl font-bold uppercase mb-4">Documents</h2>
        <div className="flex flex-col gap-4">
          {datas.publicFiles.map((data, index) => (
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
                  <LinkButton
                    type="sky"
                    size="sm"
                    link={`https://ipfs.${ipfsGatewayUrl}/ipfs/${data.cid}/userland`}
                    title="View"
                  />
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
  )
}
