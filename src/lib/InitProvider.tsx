"use client"

import React, { useEffect } from "react"
import * as odd from "@etherland/odd"
import { useRecoilValue } from "recoil"
import { getRecoil, setRecoil } from "recoil-nexus"
import { Spinner } from "@/components/common/Loader"
import { sessionStore, filesystemStore } from "@/stores/system"
import { SESSION_ERROR } from "../lib/session"
import { getBackupStatus, type BackupStatus } from "../lib/auth/backup"
import { USERNAME_STORAGE_KEY, createDID } from "../lib/auth/account"
import { oddNamespace } from "@/config/app-info"

const InitProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const initialHandler = async () => {
      const odd = await import("@etherland/odd")

      try {
        let backupStatus: BackupStatus = null

        const program: odd.Program = await odd.program({
          namespace: oddNamespace,
          debug: process.env.NODE_ENV === "test",
        })

        console.log("initProvider ", program)

        if (program.session && program.session.fs) {
          console.log("session success ")
          // Authed
          backupStatus = await getBackupStatus(program.session.fs)

          let fullUsername = (await program.components.storage.getItem(
            USERNAME_STORAGE_KEY
          )) as string
          // If the user is migrating from a version odd-app-template before https://github.com/oddsdk/odd-app-template/pull/97/files#diff-a180510e798b8f833ebfdbe691c5ec4a1095076980d3e2388de29c849b2b8361R44,
          // their username won't contain a did, so we will need to manually append a DID and add it storage here
          if (!fullUsername) {
            const did = await createDID(program.components.crypto)
            fullUsername = `${program.session.username}#${did}`
            await program.components.storage.setItem(
              USERNAME_STORAGE_KEY,
              fullUsername
            )
            window.location.reload()
          }

          let user = null

          try {
            const userInfo = await fetch("/api/addUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: fullUsername.split("#")[0],
                hashed: program.session.username,
                fullName: fullUsername,
              }),
            })
            user = await userInfo.json()
          } catch (error) {
            throw new Error(error)
          }

          setRecoil(sessionStore, {
            userInfo: {
              id: user !== null ? user.id : 0,
              sharedList:
                user !== null
                  ? user.sharedList !== null
                    ? user.sharedList.split(",")
                    : []
                  : [],
              full: fullUsername,
              hashed: program.session.username,
              trimmed: fullUsername.split("#")[0],
            },
            session: program.session,
            authStrategy: program.auth,
            program,
            loading: false,
            backupCreated: backupStatus ? backupStatus.created : false,
          })

          setRecoil(filesystemStore, program.session.fs)
        } else {
          // Not authed
          console.log("Not authed ")
          setRecoil(sessionStore, {
            userInfo: null,
            session: null,
            authStrategy: program.auth,
            program,
            loading: false,
            backupCreated: false,
          })
        }
      } catch (error) {
        console.error(error)

        const session = getRecoil(sessionStore)

        switch (error) {
          case odd.ProgramError.InsecureContext:
            setRecoil(sessionStore, {
              ...session,
              loading: false,
              error: SESSION_ERROR.INSECURE_CONTEXT,
            })
            break

          case odd.ProgramError.UnsupportedBrowser:
            setRecoil(sessionStore, {
              ...session,
              loading: false,
              error: SESSION_ERROR.UNSUPORTED_CONTEXT,
            })
            break
        }
      }
    }

    initialHandler()
  }, [])

  const session = useRecoilValue(sessionStore)

  if (session.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  return <div>{children}</div>
}

export default InitProvider
