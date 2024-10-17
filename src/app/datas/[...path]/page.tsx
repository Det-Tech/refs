import dynamic from "next/dynamic"

const DataUpload = dynamic(() => import("@/components/datas/Upload"), {
  ssr: false,
})

export default function DatasSubPage() {
  return (
    <main className="flex flex-col flex-1">
      <DataUpload />
    </main>
  )
}
