"use client"

interface AmenitiesGridProps {
  amenities: string[]
  columns?: number
}

export default function AmenitiesGrid({ amenities, columns = 4 }: AmenitiesGridProps) {
  const displayAmenities = amenities.slice(0, columns * 2)

  return (
    <div className={`grid grid-cols-${columns} gap-6`}>
      {displayAmenities.map((amenity, i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-center group cursor-pointer">
          <div className="text-primary group-hover:text-accent transition text-2xl">✓</div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition">{amenity}</span>
        </div>
      ))}
    </div>
  )
}
