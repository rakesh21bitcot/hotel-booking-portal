"use client"

import { ROUTES } from "@/utils/constants"
import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Company */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">EliteStay</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Find unique homes in vibrant places. Your trusted partner for seamless hotel booking.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition">
                Facebook
              </a>
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                Instagram
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={ROUTES.PUBLIC.HOME} className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.HOTELS} className="hover:text-primary transition">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.DESTINATIONS} className="hover:text-primary transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PROTECTED.MYBOOKING} className="hover:text-primary transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h5 className="font-semibold text-sm mb-4 text-foreground">Support</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={ROUTES.PUBLIC.CONTACT} className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.BLOG} className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h5 className="font-semibold text-sm mb-4 text-foreground">Legal</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">© {year} Bitcot. All rights reserved.</p>
          {/* <div className="flex gap-4 text-xs text-muted-foreground mt-4 md:mt-0">
            <span>We accept:</span>
            <span>Visa • Mastercard • American Express • PayPal</span>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
