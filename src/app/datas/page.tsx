import dynamic from "next/dynamic"

const DataUpload = dynamic(() => import("@/components/datas/Upload"), {
  ssr: false,
})

export default function DatasPage() {
  return (
    <main className="flex flex-col flex-1">
      <DataUpload />
    </main>
  )
}
