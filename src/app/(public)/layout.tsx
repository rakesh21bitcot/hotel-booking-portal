import type React from "react"
import { PublicLayout } from "@/components/layouts/PublicLayout"

export default function PublicLayoutGroup({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
