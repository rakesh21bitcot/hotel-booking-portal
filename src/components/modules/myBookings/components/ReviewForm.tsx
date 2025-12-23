"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Star, X } from "lucide-react"
import { useAppDispatch } from "@/store/hook"
import { createReviewWithRedux } from "@/store/actions/booking-actions"

interface ReviewFormProps {
  bookingId: string
  hotelId: string
  hotelName: string
  onReviewSubmitted: () => void
  onCancel?: () => void
  existingReview?: {
    rating: number
    comment: string
  }
}

export default function ReviewForm({
  bookingId,
  hotelId,
  hotelName,
  onReviewSubmitted,
  onCancel,
  existingReview,
}: ReviewFormProps) {
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState<number>(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [comment, setComment] = useState<string>(existingReview?.comment || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createReviewWithRedux({
        bookingId,
        hotelId,
        rating,
        comment: comment.trim()
      }))

      toast.success("Review submitted successfully!")
      onReviewSubmitted()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
            {existingReview ? "Your Review" : "Write a Review"}
          </h3>
          <p className="text-sm text-muted-foreground">{hotelName}</p>
        </div>
       
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !existingReview && setRating(star)}
                onMouseEnter={() => !existingReview && setHoveredRating(star)}
                onMouseLeave={() => !existingReview && setHoveredRating(0)}
                disabled={existingReview !== undefined}
                className={`transition-transform ${
                  existingReview ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'fill-muted text-muted'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => !existingReview && setComment(e.target.value.slice(0, 500))}
            disabled={existingReview !== undefined}
            placeholder="Share your experience with this hotel..."
            rows={5}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            required
            minLength={10}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {comment.length}/500 characters (minimum 10)
          </p>
        </div>

        {/* Submit Button */}
        {!existingReview && (
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 cursor-pointer px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 cursor-pointer border border-border rounded-lg font-semibold text-foreground hover:border-primary hover:text-primary transition"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

