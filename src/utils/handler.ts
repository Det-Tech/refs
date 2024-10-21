import mime from "mime"

export const shortFileName = (title: string) => {
  const vals = title.split(".")
  if (vals[0].length > 30) {
    return (
      vals[0].slice(0, 14) +
      "..." +
      vals[0].slice(vals[0].length - 14, vals[0].length - 1) +
      "." +
      vals[vals.length - 1]
    )
  }

  return title
}

export const shortName = (val: string) => {
  return val.slice(0, 6) + "..." + val.slice(-6)
}

export const getFileType = (name: string) => {
  return mime.getType(name)?.split("/")[0]
}

export const isImage = (name: string) => {
  return getFileType(name) === "image"
}

export const isVideo = (name: string) => {
  return getFileType(name) === "video"
}

export const isPdf = (name: string) => {
  return name?.split(".").slice(-1).toString().toLowerCase() === "pdf"
}
