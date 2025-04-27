import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import StyledComponentsRegistry from '@/lib/registry'
import GlobalPreloader from '@/components/GlobalPreloader'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import dynamic from 'next/dynamic'

// Conditionally import ClerkProvider only if we have an API key
const ClerkProviderConditional = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.ClerkProvider })))
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

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
  // Use a safer approach to check for clerk keys
  const hasClerkKey = 
    typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;

  // Safe clerk configuration for build time
  const clerkProps = hasClerkKey ? {} : {
    publishableKey: "pk_test_placeholder-key-for-build-time"
  };

  return (
    <ClerkProviderConditional {...clerkProps}>
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
    </ClerkProviderConditional>
  )
}
