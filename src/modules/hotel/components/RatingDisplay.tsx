"use client"

interface RatingDisplayProps {
  rating: number
  reviewCount: number
  showLabel?: boolean
}

export default function RatingDisplay({ rating, reviewCount, showLabel = true }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? "text-primary" : "text-muted"}>
            ★
          </span>
        ))}
      </div>

      {showLabel && (
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount.toLocaleString()} reviews)</span>
        </div>
      )}
    </div>
  )
}
