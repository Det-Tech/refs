export default function Button({
  type,
  size,
  className,
  title,
  onClick,
  LeftIcon,
  RightIcon,
  isShadow,
  isDisable,
}: {
  type: string
  size?: string
  className?: string
  title: string
  onClick?: () => void
  LeftIcon?: React.ReactNode
  RightIcon?: React.ReactNode
  isShadow?: boolean
  isDisable?: boolean
}) {
  let btnClass = ` flex justify-center items-center gap-2 w-full select-none ${isDisable ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-center rounded-md ${isShadow && "shadow-btn"}`

  switch (size) {
    case "sm":
      btnClass += " px-2 py-1 text-sm"
      break
    case "md":
      btnClass += " px-6 py-2 text-lg"
      break
    case "lg":
      btnClass += " px-8 py-2.5 text-xl"
      break
    default:
      btnClass += " px-4 py-1.5"
  }

  switch (type) {
    case "sky":
      btnClass += ` bg-sky-400 text-white ${isDisable ? "" : "hover:bg-sky-500"} `
      break
    case "orange":
      btnClass += ` bg-orange-400 text-white ${isDisable ? "" : "hover:bg-orange-500"} `
      break
    case "green":
      btnClass += ` bg-green text-white ${isDisable ? "" : "hover:bg-green-dark"} `
      break
    case "white":
      btnClass += ` bg-white text-black ${isDisable ? "" : "hover:bg-green-dark"} `
      break
    case "black":
      btnClass += ` bg-black-light text-white ${isDisable ? "" : "hover:bg-black"} `
      break
    case "trans":
      btnClass += ` bg-transparent text-white border border-white ${isDisable ? "" : "hover:bg-black-semiLight"}`
      break
    default:
      btnClass += " text-black"
  }

  return (
    <div
      className={btnClass + " " + (className ? className : "")}
      onClick={() => (onClick !== undefined ? onClick() : void 0)}
    >
      {LeftIcon && <div className="flex items-center w-5 h-5">{LeftIcon}</div>}
      {title}
      {RightIcon && (
        <div className="flex items-center w-5 h-5">{RightIcon}</div>
      )}
    </div>
  )
}
