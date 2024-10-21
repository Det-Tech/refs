import { useCallback, useEffect, useState } from "react"
import Button from "../common/Button"
import { IUser } from "@/config/interfaces"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { useRecoilValue, useRecoilState } from "recoil"
import { contactListStore } from "@/stores/data"
import { sessionStore } from "@/stores/system"

export default function AllUsers() {
  const [session, setSession] = useRecoilState(sessionStore)
  const [contactList, setContactList] = useRecoilState(contactListStore)
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [users, setUsers] = useState<IUser[]>(contactList.all)
  const [userIds, setUserIds] = useState<number[]>(
    contactList.all.map((user) => {
      return user.id
    })
  )

  const searchHandler = useCallback(() => {
    const filterUsers = contactList.all.filter((user) =>
      user.name.includes(contactList.searchName)
    )
    setUsers([...filterUsers])
    setUserIds(
      filterUsers.map((user) => {
        return user.id
      })
    )
  }, [contactList])

  const keyDownHandler = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        searchHandler()
      }
    },
    [contactList]
  )

  const selectAllHandler = useCallback(
    (v: boolean) => {
      setIsSelectAll(v)
      setSelectedUserIds(v ? userIds : [])
    },
    [userIds]
  )

  const selectUserHandler = useCallback(
    (id: number, checked: boolean) => {
      if (checked) {
        setSelectedUserIds((preArray) => [...preArray, id])
      } else {
        setSelectedUserIds(selectedUserIds.filter((userId) => userId !== id))
      }
    },
    [selectedUserIds]
  )

  useEffect(() => {
    setIsSelectAll(selectedUserIds.length > 0)
  }, [selectedUserIds])

  const setShareListHandler = useCallback(async () => {
    const _shareInfo = await fetch("/api/setShareList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.userInfo.id,
        shareList: selectedUserIds.join(","),
      }),
    })
    const shareInfo = await _shareInfo.json()

    setSession({
      ...session,
      userInfo: {
        ...session.userInfo,
        sharedList: shareInfo.sharedList.split(","),
      },
    })
  }, [selectedUserIds])

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 select-none">
          <input
            type="text"
            className="px-4 py-2 rounded-md focus:outline-none"
            value={contactList.searchName}
            onChange={(e) =>
              setContactList({ ...contactList, searchName: e.target.value })
            }
            onKeyDown={(e) => keyDownHandler(e)}
          />
          <Button
            type="sky"
            size=""
            className=""
            title="Search"
            onClick={() => searchHandler()}
          />
        </div>
        <Button
          type="green"
          title="Move To Share List"
          LeftIcon={<PlusCircleIcon className="w-6" />}
          isDisable={selectedUserIds.length === 0}
          onClick={() => setShareListHandler()}
        />
      </div>
      <div className="flex flex-col gap-2 mt-6 bg-white rounded-lg py-4">
        <div className="grid grid-cols-12 gap-2 border-b pb-2">
          <div className="col-span-1 flex justify-center items-center select-none ">
            <input
              type="checkbox"
              checked={isSelectAll}
              className="w-4 h-4 cursor-pointer"
              onChange={(e) => selectAllHandler(e.target.checked)}
            />
          </div>
          <div className="col-span-3">Name</div>
          <div className="col-span-6">Hashed</div>
          <div className="col-span-2 text-center">Status</div>
        </div>
        {users.map((user: IUser, index: number) => (
          <div key={index} className="grid grid-cols-12 gap-2 border-b pb-2">
            <div className="col-span-1 flex justify-center items-center select-none">
              <input
                type="checkbox"
                className="w-4 h-4  cursor-pointer"
                checked={selectedUserIds.includes(user.id)}
                onChange={(e) => selectUserHandler(user.id, e.target.checked)}
              />
            </div>
            <div className="col-span-3 break-all">{user.name}</div>
            <div className="col-span-6 break-all">{user.hashed}</div>
            <div className="col-span-2 flex justify-center items-center">
              {session.userInfo.sharedList.includes(user.id.toString()) && (
                <div className="rounded-full px-3 py-1 text-xs bg-green-400 ">
                  Shared
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
