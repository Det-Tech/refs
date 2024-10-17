import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  Bars3Icon,
  ArrowUpTrayIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline"

export default function DropBox({
  setOpenFileUpload,
  setOpenCreateFolder,
}: {
  setOpenFileUpload: (val: boolean) => void
  setOpenCreateFolder: (val: boolean) => void
}) {
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <MenuButton>
              <Bars3Icon className="w-6 cursor-pointer" />
            </MenuButton>
            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-30 z-10" />
            )}
            <MenuItems
              transition
              anchor="bottom end"
              className="w-40 origin-top-right rounded-md border border-white/5 bg-white mt-2 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-20"
            >
              <MenuItem>
                <button
                  className="group flex w-full items-center gap-2 py-2 px-3 data-[focus]:bg-gray-100"
                  onClick={() => {
                    setOpenFileUpload(true)
                    setOpenCreateFolder(false)
                  }}
                >
                  <ArrowUpTrayIcon className="w-4" />
                  Add Files
                </button>
              </MenuItem>
              <div className="h-px bg-gray-100" />
              <MenuItem>
                <button
                  className="group flex w-full items-center gap-2 py-2 px-3  data-[focus]:bg-gray-100"
                  onClick={() => {
                    setOpenCreateFolder(true)
                    setOpenFileUpload(false)
                  }}
                >
                  <FolderPlusIcon className="w-4" />
                  Create directory
                </button>
              </MenuItem>
            </MenuItems>
          </>
        )}
      </Menu>
    </div>
  )
}
