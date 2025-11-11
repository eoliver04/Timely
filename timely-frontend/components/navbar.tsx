"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, LayoutDashboard, LogOut, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/businesses", label: "Negocios", icon: Building2 },
    { href: "/my-businesses", label: "Mis Negocios", icon: Building2 },
    { href: "/appointments", label: "Reservas", icon: Calendar },
    { href: "/profile", label: "Perfil", icon: UserCircle },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/logo_timely.png"
                  alt="Timely"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-primary hidden sm:inline-block">Timely</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2",
                        isActive && "bg-blue-50 text-primary hover:bg-blue-100 hover:text-primary",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto gap-1 pb-3 -mx-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link key={item.href} href={item.href} className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 text-xs whitespace-nowrap",
                    isActive && "bg-blue-50 text-primary hover:bg-blue-100 hover:text-primary",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
