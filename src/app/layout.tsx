import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ReduxProvider } from "@/store/providers"
import ToastProvider from "@/components/providers/ToastProvider"
import "react-toastify/dist/ReactToastify.css"
import DialogProvider from "@/components/providers/DialogProvider"
import { ConditionalLayout } from "@/components/layouts/ConditionalLayout"


export const metadata: Metadata = {
  title: "EliteStay - Trusted Hotels, Seamless Booking",
  description: "Find unique homes in vibrant places. Book your perfect stay with EliteStay.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased Marcellus serif`}>
        <ReduxProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ToastProvider />
          <DialogProvider />
        </ReduxProvider>
      </body>
    </html>
  )
}
