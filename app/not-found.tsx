import Link from "next/link"
import { ROUTES } from "@/utils/constants"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <p className="text-2xl font-semibold mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href={ROUTES.PUBLIC.HOME}
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
