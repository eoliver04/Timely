"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, LayoutDashboard, LogOut } from "lucide-react"
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
    { href: "/businesses", label: "Todos los Negocios", icon: Building2 },
    { href: "/my-businesses", label: "Mis Negocios", icon: Building2 },
    { href: "/appointments", label: "Reservas", icon: Calendar },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              Timely
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
        <div className="md:hidden flex items-center gap-1 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-2 text-xs",
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
    </nav>
  )
}
