import Link from "next/link"
import Image from "next/image"

export default function LinkButton({
  type,
  size,
  link,
  title,
  isSelf,
  className,
  LeftIcon,
  RightIcon,
  isShadow,
}: {
  type: string
  size?: string
  link: string
  title: string
  isSelf?: boolean
  className?: string
  LeftIcon?: React.ReactNode
  RightIcon?: React.ReactNode
  isShadow?: boolean
}) {
  const isDisable = link !== "" ? false : true

  let btnClass = ` flex justify-center items-center gap-2 w-full select-none ${isDisable ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-center rounded-md font-lato ${isShadow && "shadow-btn"}`
  let iconSize = ` w-3 sm:w-4 h-3 sm:h-4`

  switch (size) {
    case "sm":
      btnClass += " px-2 py-1 text-sm"
      iconSize = ` w-2 sm:w-3 h-2 sm:h-3`
      break
    case "md":
      btnClass += " px-6 py-2 text-lg"
      iconSize = ` w-4 sm:w-5 h-4 sm:h-5`
      break
    case "lg":
      btnClass += " px-8 py-2.5 text-xl"
      iconSize = ` w-5 sm:w-6 h-5 sm:h-6`
      break
    default:
      btnClass += " px-4 py-1.5"
      iconSize = ` w-3 sm:w-4 h-3 sm:h-4`
  }

  switch (type) {
    case "sky":
      btnClass += ` bg-sky-400 text-white ${isDisable ? "" : "hover:bg-sky-500 "} `
      break
    case "orange":
      btnClass += ` bg-orange-400 text-white ${isDisable ? "" : "hover:bg-orange-500 "} `
      break
    case "green":
      btnClass += ` bg-green text-white ${isDisable ? "" : "hover:bg-green-dark "} `
      break
    case "trans":
      btnClass += ` bg-transparent text-white border border-white ${isDisable ? "" : "hover:bg-black-semiLight"}`
      break
    default:
      btnClass += " text-black"
  }

  return (
    <div className="flex">
      <Link
        href={link}
        className={btnClass + " " + (className ? className : "")}
        target={isSelf ? "_self" : "_blank"}
      >
        {LeftIcon && (
          <div className="flex items-center w-5 h-5">{LeftIcon}</div>
        )}
        {title}
        {RightIcon && (
          <div className="flex items-center w-5 h-5">{RightIcon}</div>
        )}
      </Link>
    </div>
  )
}
