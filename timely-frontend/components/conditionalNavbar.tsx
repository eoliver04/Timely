"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show navbar on auth pages and home page
  const hideNavbar = pathname === "/" || pathname === "/login" || pathname === "/register"

  if (hideNavbar) return null

  return <Navbar />
}
