"use client"

import Link from "next/link"
import { useState } from "react"
import { ROUTES } from "@/utils/constants"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Hotels", href: ROUTES.PUBLIC.HOTELS },
    { label: "Destinations", href: ROUTES.PUBLIC.DESTINATIONS },
    { label: "Blog", href: ROUTES.PUBLIC.BLOG },
    { label: "Contact", href: ROUTES.PUBLIC.CONTACT },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
            ES
          </div>
          <span className="font-serif font-bold text-xl hidden sm:inline">EliteStay</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.PUBLIC.LOGIN}
            className="hidden sm:inline-block text-sm font-medium hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href={ROUTES.PUBLIC.REGISTER}
            className="hidden sm:inline-block bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </Link>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border md:hidden">
            <div className="px-4 py-2 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <Link
                  href={ROUTES.PUBLIC.LOGIN}
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.PUBLIC.REGISTER}
                  className="block bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 mt-2"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
