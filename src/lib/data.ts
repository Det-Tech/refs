import * as odd from "@etherland/odd"
import { getRecoil, setRecoil } from "recoil-nexus"
import type PublicFile from "@etherland/odd/fs/v1/PublicFile"
import type PrivateFile from "@etherland/odd/fs/v1/PrivateFile"
import { isFile } from "@etherland/odd/fs/types/check"
import { toast } from "react-toastify"
import { filesystemStore } from "@/stores/system"
import { dataStore, AREAS } from "@/stores/data"
import { fileToUint8Array } from "@/lib/utils"

export type Product = {
  cid: string
  ctime: number
  name: string
  private: boolean
  size: number
  src: string
  histories: []
}

export type Data = {
  public: {
    files: Product[]
    folders: string[]
  }
  private: {
    files: Product[]
    folders: string[]
  }
  shared: {
    files: Product[]
    folders: string[]
  }
  selectedArea: AREAS
  loading: boolean
}

type Link = {
  size: number
}

export const Data_DIRS = {
  [AREAS.PUBLIC]: odd.path.directory("public", "data"),
  [AREAS.PRIVATE]: odd.path.directory("private", "data"),
  [AREAS.SHARED]: odd.path.directory("private", "shared"),
}

const FILE_SIZE_LIMIT = 20

/**
 * Get files from the user's WNFS and construct the `src` value for the files
 */

export const getFilesFromWNFS: (paths: string[]) => Promise<void> = async (
  paths
) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  // Set loading: true on the dataStore
  setRecoil(dataStore, { ...data, loading: true })

  const { selectedArea } = data
  const isPrivate = selectedArea === AREAS.PRIVATE
  const isShared = selectedArea === AREAS.SHARED

  const directory = odd.path.combine(Data_DIRS[selectedArea], {
    directory: paths,
  })

  try {
    // Get list of links for files in the data dir
    const isExist = await fs.exists(directory)
    if (!isExist) return

    const links = await fs.ls(directory)

    let folders = []
    let files = await Promise.all(
      Object.entries(links).map(async ([name]) => {
        const file = await fs.get(
          odd.path.combine(directory, odd.path.file(`${name}`))
        )

        if (!isFile(file)) {
          folders.push(name)
          return null
        }

        // The CID for private files is currently located in `file.header.content`,
        // whereas the CID for public files is located in `file.cid`
        const cid =
          isPrivate || isShared
            ? (file as PrivateFile).header.content.toString()
            : (file as PublicFile).cid.toString()

        // Create a blob to use as the image `src`
        const blob = new Blob([file.content])
        const src = URL.createObjectURL(blob)

        const ctime =
          isPrivate || isShared
            ? (file as PrivateFile).header.metadata.unixMeta.ctime
            : (file as PublicFile).header.metadata.unixMeta.ctime

        return {
          cid,
          ctime,
          name,
          private: isPrivate,
          size: (links[name] as Link).size,
          src,
        }
      })
    )
    // Sort files by ctime(created at date)
    // NOTE: this will eventually be controlled via the UI
    files = files.filter((a) => !!a)
    files.sort((a, b) => b.ctime - a.ctime)

    // Push files to the dataStore
    setRecoil(dataStore, {
      ...data,
      ...(isShared
        ? {
            shared: {
              files: files,
              folders: folders,
            },
          }
        : isPrivate
          ? {
              private: {
                files: files,
                folders: folders,
              },
            }
          : {
              public: {
                files: files,
                folders: folders,
              },
            }),
      loading: false,
    })
  } catch (error) {
    console.log("get wnfs file error: ", error)
    setRecoil(dataStore, {
      ...data,
      loading: false,
    })
  }
}

/**
 * Upload an file to the user's private or public WNFS
 * @param file
 */
export const uploadFileToWNFS: (
  paths: string[],
  file: File
) => Promise<void> = async (paths, file) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  try {
    const { selectedArea } = data

    const directory = odd.path.combine(Data_DIRS[selectedArea], {
      directory: paths,
    })

    // Reject files over 20MB
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > FILE_SIZE_LIMIT) {
      throw new Error("Image can be no larger than 20MB")
    }

    // Reject the upload if the file already exists in the directory
    const fileExists = await fs.exists(
      odd.path.combine(directory, odd.path.file(file.name))
    )
    if (fileExists) {
      throw new Error(`${file.name} file already exists`)
    }

    // Create a sub directory and add some content
    await fs.write(
      odd.path.combine(directory, odd.path.file(file.name)),
      await fileToUint8Array(file)
    )

    // Announce the changes to the server
    await fs.publish()
    toast.success(`${file.name} file has been published`)
  } catch (error) {
    toast.error((error as Error).message)
    console.error(error)
  }
}

/**
 * Delete an file from the user's private or public WNFS
 * @param name
 */
export const deleteFileFromWNFS: (
  paths: string[],
  name: string
) => Promise<void> = async (paths, name) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  try {
    const { selectedArea } = data

    const directory = odd.path.combine(Data_DIRS[selectedArea], {
      directory: paths,
    })

    const fileExists = await fs.exists(
      odd.path.combine(directory, odd.path.file(name))
    )

    if (fileExists) {
      // Remove files from server
      await fs.rm(odd.path.combine(directory, odd.path.file(name)))

      // Announce the changes to the server
      await fs.publish()

      toast.success(`${name} file has been deleted`)

      // Refetch files and update dataStore
      await getFilesFromWNFS(paths)
    } else {
      throw new Error(`${name} file has already been deleted`)
    }
  } catch (error) {
    toast.error((error as Error).message)
    console.error(error)
  }
}

/**
 * Upload an file to the user's private or public WNFS
 * @param file
 */
export const createFolderToWNFS: (
  paths: string[],
  folderName: string
) => Promise<void> = async (paths, folderName) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  const { selectedArea } = data

  const directory = odd.path.combine(Data_DIRS[selectedArea], {
    directory: paths,
  })

  try {
    await fs.mkdir(odd.path.combine(directory, odd.path.directory(folderName)))
    await fs.publish()
  } catch (error) {
    toast.error((error as Error).message)
  }
}
