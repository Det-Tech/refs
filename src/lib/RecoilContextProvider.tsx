"use client"

import React from "react"
import { RecoilRoot } from "recoil"
import RecoilNexus from "recoil-nexus"

const RecoilContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <RecoilNexus />
      {children}
    </RecoilRoot>
  )
}

export default RecoilContextProvider
