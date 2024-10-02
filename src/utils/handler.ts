export const shortFileName = (title: string) => {
  const vals = title.split(".")
  if (vals[0].length > 10) {
    return (
      vals[0].slice(0, 5) +
      "..." +
      vals[0].slice(vals[0].length - 5, vals[0].length - 1) +
      "." +
      vals[vals.length - 1]
    )
  }

  return title
}

export const shortName = (val: string) => {
  return val.slice(0, 6) + "..." + val.slice(-6)
}
