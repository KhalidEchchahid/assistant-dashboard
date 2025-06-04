import { Braces } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`bg-primary rounded-lg p-2 text-primary-foreground ${className}`}>
      <Braces className="h-full w-full" />
    </div>
  )
}
