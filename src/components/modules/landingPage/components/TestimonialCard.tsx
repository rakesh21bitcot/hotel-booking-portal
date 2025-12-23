"use client"

interface TestimonialCardProps {
  testimonial?: {
    id: string
    user_name: string
    role: string
    rating: number
    comment?: string
    avatar: string
  }
  user_name?: string
  role?: string
  avatar?: string
  rating?: number
  comment?: string
  message?: string
  date?: string
  delay?: number
}

function TestimonialCard({
  testimonial,
  user_name = testimonial?.user_name || "",
  role = testimonial?.role || "Verified Guest",
  avatar = testimonial?.avatar || "",
  rating = testimonial?.rating || 5,
  comment = testimonial?.comment || "",
  date = new Date().toLocaleDateString(),
  delay = 0,
}: TestimonialCardProps) {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 animate-fade-in hover:border-primary transition"
      style={{ animationDelay: `${delay ?? 0}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img src={"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"} alt={user_name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-semibold text-foreground">{user_name}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? "text-primary" : "text-muted"}>
            ★
          </span>
        ))}
      </div>

      {/* Text */}
      <p className="text-foreground text-sm mb-4 leading-relaxed">"{comment}"</p>

      {/* Date */}
      <p className="text-xs text-muted-foreground">
        {typeof date === "string"
          ? new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric"
            })
          : ""}
      </p>
    </div>
  )
}

export { TestimonialCard }
export default TestimonialCard
