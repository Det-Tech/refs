import { useState, useCallback } from "react"
import { FolderPlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Button from "./Button"
import { Spinner } from "./Loader"
import { getFilesFromWNFS, createFolderToWNFS } from "@/lib/data"
import { type Data } from "@/lib/data"

export default function CreateFolder({
  datas,
  setOpenCreateFolder,
  paths,
}: {
  datas: Data
  setOpenCreateFolder: (val: boolean) => void
  paths: string[]
}) {
  const [name, setName] = useState<string>("")

  const handleUpdateFile = useCallback(async () => {
    if (name === "" || datas.loading) return

    await createFolderToWNFS(paths, name)

    getFilesFromWNFS(paths)
    setName("")
  }, [paths, name, datas])

  return (
    <div className="border-b border-white pb-8 mb-8">
      <h2 className="text-xl font-bold uppercase mb-4">Create a folder</h2>
      <div className="relative flex items-center gap-6  bg-gray-semiLight pl-6 pr-16 py-6 rounded-md">
        <XMarkIcon
          className="w-6 absolute right-4 top-4 opacity-70 cursor-pointer hover:opacity-90"
          onClick={() => setOpenCreateFolder(false)}
        />
        <div className="flex gap-16">
          <input
            type="text"
            placeholder="Folder Name"
            className={`rounded-md px-4 py-1.5 border focus:outline-none focus:border-gray-light`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Button
            type="orange"
            title={datas.loading ? "Creating..." : "Create"}
            LeftIcon={
              datas.loading ? <Spinner className="w-5" /> : <FolderPlusIcon />
            }
            onClick={() => handleUpdateFile()}
            isDisable={datas.loading || name === ""}
          />
        </div>
      </div>
    </div>
  )
}
