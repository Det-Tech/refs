import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { accountSettingsStore, sessionStore } from "@/stores/system"
import { getAvatarFromWNFS } from "@/lib/account-settings"
import { UserIcon } from "@heroicons/react/20/solid"

let imagesFetched = false

const Avatar = ({ size = "large" }) => {
  const accountSettings = useRecoilValue(accountSettingsStore)
  const session = useRecoilValue(sessionStore)

  const sizeClasses =
    size === "large"
      ? "w-[88px] h-[88px] text-[40px] border-black-light"
      : "w-[30px] h-[30px] text-sm border-gray-100"

  const loaderSizeClasses =
    size === "large" ? "w-[28px] h-[28px]" : "w-[16px] h-[16px]"

  const useMountEffect = () =>
    useEffect(() => {
      if (!imagesFetched) {
        getAvatarFromWNFS()
        imagesFetched = true
      }
    }, [])

  useMountEffect()

  return (
    <>
      {accountSettings.avatar ? (
        <>
          {accountSettings.loading ? (
            <div
              className={`flex items-center justify-center object-cover rounded-full border-2 ${sizeClasses}`}
            >
              <span
                className={`animate-spin ease-linear rounded-full border-2 border-t-2 border-t-orange-500 border-black-light ${loaderSizeClasses}`}
              />
            </div>
          ) : (
            <img
              className={`object-cover rounded-full border-2 bg-white ${sizeClasses}`}
              src={accountSettings.avatar.src}
              alt="User Avatar"
            />
          )}
        </>
      ) : (
        <UserIcon className={`border rounded-full p-1 ${sizeClasses}`} />
      )}
    </>
  )
}

export default Avatar
