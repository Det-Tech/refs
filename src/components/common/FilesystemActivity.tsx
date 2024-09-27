type Props = {
  activity: "Initializing" | "Loading"
}

const FilesystemActivity = ({ activity }: Props) => (
  <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
    <p className="flex items-center justify-center text-2xl text-white">
      <span className="rounded-xl border-t-2 border-l-2 border-base-content w-6 h-6 inline-block animate-spin mr-4" />
      {activity} file system...
    </p>
  </div>
)

export default FilesystemActivity
