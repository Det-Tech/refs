import * as odd from "@oddjs/odd"
import { getRecoil, setRecoil } from "recoil-nexus"
import type PublicFile from "@oddjs/odd/fs/v1/PublicFile"
import type PrivateFile from "@oddjs/odd/fs/v1/PrivateFile"
import { isFile } from "@oddjs/odd/fs/types/check"

import { filesystemStore } from "@/stores/system"
import { dataStore, AREAS } from "@/stores/data"
import { addNotification } from "@/lib/notifications"
import { fileToUint8Array } from "@/lib/utils"

export type Product = {
  cid: string
  ctime: number
  name: string
  private: boolean
  size: number
  src: string
}

export type Data = {
  publicFiles: Product[]
  privateFiles: Product[]
  sharedFiles: Product[]
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

export const getFilesFromWNFS: () => Promise<void> = async () => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  try {
    // Set loading: true on the dataStore
    setRecoil(dataStore, { ...data, loading: true })

    const { selectedArea } = data
    const isPrivate = selectedArea === AREAS.PRIVATE
    const isShared = selectedArea === AREAS.SHARED

    // Set path to either private or public data dir
    const path = Data_DIRS[selectedArea]

    // Get list of links for files in the data dir
    const links = await fs.ls(path)

    let files = await Promise.all(
      Object.entries(links).map(async ([name]) => {
        const file = await fs.get(
          odd.path.combine(Data_DIRS[selectedArea], odd.path.file(`${name}`))
        )

        if (!isFile(file)) return null

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
            sharedFiles: files,
          }
        : isPrivate
          ? {
              privateFiles: files,
            }
          : {
              publicFiles: files,
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

export const uploadFileToWNFS: (file: File) => Promise<void> = async (file) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  try {
    const { selectedArea } = data

    // Reject files over 20MB
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > FILE_SIZE_LIMIT) {
      throw new Error("Image can be no larger than 20MB")
    }

    // Reject the upload if the file already exists in the directory
    const fileExists = await fs.exists(
      odd.path.combine(Data_DIRS[selectedArea], odd.path.file(file.name))
    )
    if (fileExists) {
      throw new Error(`${file.name} file already exists`)
    }

    // Create a sub directory and add some content
    await fs.write(
      odd.path.combine(Data_DIRS[selectedArea], odd.path.file(file.name)),
      await fileToUint8Array(file)
    )

    // Announce the changes to the server
    await fs.publish()

    addNotification({
      msg: `${file.name} file has been published`,
      type: "success",
    })
  } catch (error) {
    addNotification({ msg: (error as Error).message, type: "error" })
    console.error(error)
  }
}

/**
 * Delete an file from the user's private or public WNFS
 * @param name
 */
export const deleteFileFromWNFS: (name: string) => Promise<void> = async (
  name
) => {
  const data = getRecoil(dataStore)
  const fs = getRecoil(filesystemStore)
  if (!fs) return

  try {
    const { selectedArea } = data

    const fileExists = await fs.exists(
      odd.path.combine(Data_DIRS[selectedArea], odd.path.file(name))
    )

    if (fileExists) {
      // Remove files from server
      await fs.rm(
        odd.path.combine(Data_DIRS[selectedArea], odd.path.file(name))
      )

      // Announce the changes to the server
      await fs.publish()

      addNotification({
        msg: `${name} file has been deleted`,
        type: "success",
      })

      // Refetch files and update dataStore
      await getFilesFromWNFS()
    } else {
      throw new Error(`${name} file has already been deleted`)
    }
  } catch (error) {
    addNotification({ msg: (error as Error).message, type: "error" })
    console.error(error)
  }
}