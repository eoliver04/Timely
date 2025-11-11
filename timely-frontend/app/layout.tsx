import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "@/app/globals.css"
import { LayoutContent } from "@/components/layoutContent"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Timely - Gestión de Negocios y Reservas",
  description: "Plataforma completa para administrar negocios y reservas",
  generator: "Next.js",
  icons: {
    icon: '/logo_timely.png',
    shortcut: '/logo_timely.png',
    apple: '/logo_timely.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  )
}
