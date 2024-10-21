import { useCallback, useState } from "react"
import {
  DocumentTextIcon,
  FolderIcon,
  FilmIcon,
  PhotoIcon,
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"
import { useRecoilValue } from "recoil"
import Link from "next/link"
import Nav from "./Nav"
import PreviewModal from "./PreviewModal"
import FileUploader from "../common/FileUploader"
import DropBox from "../common/Dropbox"
import CreateFolder from "../common/CreateFolder"
import { getFilesFromWNFS, deleteFileFromWNFS } from "@/lib/data"
import { shortFileName, isVideo, isImage, isPdf } from "@/utils/handler"
import { dataStore } from "@/stores/data"
import { Product } from "@/lib/data"

const FileIcon = ({ name }: { name: string }) => {
  if (isVideo(name)) return <FilmIcon className="w-6" />

  if (isPdf(name)) {
    return <DocumentTextIcon className="w-6" />
  }

  if (isImage(name)) {
    return <PhotoIcon className="w-6" />
  }

  return <DocumentIcon className="w-6" />
}

export default function PublicData({ paths }: { paths: string[] }) {
  const datas = useRecoilValue(dataStore)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState<Product>()
  const [openFileUpload, setOpenFileUpload] = useState<boolean>(false)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)

  const handleDeleteFile = useCallback(
    async (name: string) => {
      await deleteFileFromWNFS(paths, name)

      getFilesFromWNFS(paths)
    },
    [paths]
  )

  const handlePreviewFile = useCallback((data: Product) => {
    setSelectedData(data)
    setIsPreview(true)
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Nav paths={paths} />
        <DropBox
          setOpenFileUpload={setOpenFileUpload}
          setOpenCreateFolder={setOpenCreateFolder}
        />
      </div>
      {openFileUpload && (
        <FileUploader
          datas={datas}
          setOpenFileUpload={setOpenFileUpload}
          paths={paths}
        />
      )}
      {openCreateFolder && (
        <CreateFolder
          datas={datas}
          setOpenCreateFolder={setOpenCreateFolder}
          paths={paths}
        />
      )}
      <div className="">
        <h2 className="text-xl font-bold uppercase mb-4">Documents</h2>
        <div className="flex flex-col gap-4">
          {datas.public.files.map((data, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-2 bg-gray-semiLight hover:bg-sky-100 hover:bg-opacity-50 rounded-lg p-4 group"
            >
              <div className="flex-1 flex items-center gap-2" title={data.name}>
                <FileIcon name={data.name} />
                {shortFileName(data.name)}
              </div>
              <div className="flex justify-center items-center gap-4">
                <EyeIcon
                  title="Preview"
                  className="w-5 hidden group-hover:block cursor-pointer opacity-70 hover:opacity-100 text-green-600"
                  onClick={() => handlePreviewFile(data)}
                />
                <ShareIcon
                  title="Share"
                  className="w-5 hidden group-hover:block cursor-pointer opacity-70 hover:opacity-100 text-orange-400"
                  onClick={() => handlePreviewFile(data)}
                />
                <TrashIcon
                  title="Delete"
                  className="w-5 hidden group-hover:block cursor-pointer opacity-70 hover:opacity-100 text-red-600"
                  onClick={() => handleDeleteFile(data.name)}
                />
              </div>
            </div>
          ))}
          {datas.public.folders.map((name, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-2 bg-gray-semiLight hover:bg-sky-100 hover:bg-opacity-50 rounded-lg p-4 select-none group"
            >
              <Link
                className="flex-1 flex items-center gap-2 "
                href={window.location.href + "/" + name}
              >
                <FolderIcon className="w-6" />
                {name}
              </Link>
              <TrashIcon
                className="w-5 hidden group-hover:block cursor-pointer opacity-70 hover:opacity-100 text-red-600"
                onClick={() => handleDeleteFile(name)}
              />
            </div>
          ))}
        </div>
      </div>
      <PreviewModal
        isOpen={isPreview}
        setIsOpen={setIsPreview}
        data={selectedData}
      />
    </div>
  )
}
