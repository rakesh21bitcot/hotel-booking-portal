export interface LoaderProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
}

export function Loader({ size = "md", text }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}
