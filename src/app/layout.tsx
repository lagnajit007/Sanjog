import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

// Initialize the Inter font with proper configuration for Next.js 15+
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

// Define metadata
export const metadata: Metadata = {
  title: "Sanjog - Sign Language Learning Platform",
  description: "A platform for learning sign language",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased">
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
