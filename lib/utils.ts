import { clsx, type ClassValue } from "clsx"
import { randomBytes } from "crypto"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateApiKey(): string {
  // Generate a secure random API key
  const prefix = "ak_" // API key prefix
  const randomPart = randomBytes(32).toString("hex")
  return `${prefix}${randomPart}`
}