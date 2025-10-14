"use client"

import type React from "react"

import { ConditionalNavbar } from "@/components/conditionalNavbar"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConditionalNavbar />
      {children}
    </>
  )
}
