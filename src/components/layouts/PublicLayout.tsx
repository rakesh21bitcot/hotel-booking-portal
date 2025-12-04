import type React from "react"
import { Header } from "../common/Header"
import { Footer } from "../common/Footer"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow">{children}</main>
     
    </div>
  )
}
