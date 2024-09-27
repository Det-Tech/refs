export default function Input({
  type,
  name,
  placeholder,
  val,
  setVal,
  className,
}: {
  type: string
  name: string
  placeholder: string
  val: string
  setVal: (type: string, val: string) => void
  className?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`rounded-full px-4 py-1.5 border focus:outline-none focus:border-gray-light ${className}`}
      value={val}
      onChange={(e) => setVal(name, e.target.value)}
    />
  )
}
