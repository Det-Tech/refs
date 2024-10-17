import { getAvatarFromWNFS, uploadAvatarToWNFS } from "@/lib/account-settings"
import Avatar from "./Avatar"

const AvatarUpload = () => {
  /**
   * Handle uploads made by interacting with the file input
   */
  const handleFileInput: (file: File) => Promise<void> = async (file) => {
    await uploadAvatarToWNFS(file)

    // Refetch avatar and update accountSettingsStore
    await getAvatarFromWNFS()
  }

  return (
    <div className="bg-white w-full p-6 rounded-lg">
      <h2 className="text-3xl font-bold uppercase mb-6">
        Account Setting
      </h2>

      <h3 className="text-xl font-bold mb-4">Avatar</h3>
      <div className="flex items-center gap-6">
        <Avatar />
        <label
          htmlFor="upload-avatar"
          className="bg-white hover:bg-gray-100 text-black border border-gray-400 select-none px-4 py-2 rounded-lg cursor-pointer"
        >
          Upload a new avatar
        </label>
        <input
          onChange={(e) => handleFileInput(e.target.files[0])}
          id="upload-avatar"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  )
}

export default AvatarUpload
