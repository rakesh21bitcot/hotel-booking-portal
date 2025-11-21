"use client"

import { useEffect, useRef, ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  animation?: "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "slide-up"
  delay?: number
  className?: string
  threshold?: number
}

export default function ScrollAnimation({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.1,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [delay, threshold])

  const animationClass = `scroll-${animation}`

  return (
    <div ref={elementRef} className={`${animationClass} ${className}`}>
      {children}
    </div>
  )
}


