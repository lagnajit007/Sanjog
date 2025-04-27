import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import StyledComponentsRegistry from '@/lib/registry'
import GlobalPreloader from '@/components/GlobalPreloader'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'

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
  icons: [
    { rel: 'icon', url: '/S-logo.svg' }
  ]
}

// Define viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
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
          <StyledComponentsRegistry>
            <ClientErrorBoundary>
              <div className="min-h-screen bg-background text-foreground">
                <GlobalPreloader />
                {children}
              </div>
            </ClientErrorBoundary>
          </StyledComponentsRegistry>
        </body>
      </html>
    </ClerkProvider>
  )
}
