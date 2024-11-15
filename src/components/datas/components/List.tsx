import Link from "next/link"
import {
  DocumentTextIcon,
  FolderIcon,
  FilmIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { shortFileName, isVideo, isImage, isPdf } from "@/utils/handler"
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

export default function List({
  data,
  previewHandler,
  deleteHandler,
}: {
  data: {
    files: Product[]
    folders: string[]
  }
  previewHandler: (val: Product) => void
  deleteHandler: (val: string) => void
}) {
  return (
    <div className="">
      <h2 className="text-xl font-bold uppercase mb-4">Documents</h2>
      <div className="flex flex-col gap-4">
        {data.files.map((data, index) => (
          <div
            key={index}
            className="flex justify-between items-center gap-2 bg-gray-semiLight hover:bg-sky-100 hover:bg-opacity-50 rounded-lg p-4 group cursor-pointer"
            onClick={() => previewHandler(data)}
          >
            <div className="flex-1 flex items-center gap-2" title={data.name}>
              <FileIcon name={data.name} />
              {shortFileName(data.name)}
            </div>
          </div>
        ))}
        {data.folders.map((name, index) => (
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
              className="w-5 hidden group-hover:block cursor-pointer opacity-70 hover:opacity-100 text-gray-600"
              onClick={() => deleteHandler(name)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
