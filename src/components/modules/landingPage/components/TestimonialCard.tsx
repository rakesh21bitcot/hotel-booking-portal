"use client"

interface TestimonialCardProps {
  testimonial?: {
    id: string
    name: string
    role: string
    rating: number
    message: string
    avatar: string
  }
  name?: string
  role?: string
  avatar?: string
  rating?: number
  text?: string
  message?: string
  date?: string
  delay?: number
}

function TestimonialCard({
  testimonial,
  name = testimonial?.name || "",
  role = testimonial?.role || "",
  avatar = testimonial?.avatar || "",
  rating = testimonial?.rating || 5,
  text = testimonial?.message || "",
  message,
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
        <img src={avatar || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-semibold text-foreground">{name}</h4>
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
      <p className="text-foreground text-sm mb-4 leading-relaxed">"{text || message}"</p>

      {/* Date */}
      <p className="text-xs text-muted-foreground">{date}</p>
    </div>
  )
}

export { TestimonialCard }
export default TestimonialCard
