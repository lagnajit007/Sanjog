"use client"

import { useState, useEffect } from "react"
import PageTransition from "@/components/PageTransition"
import CustomCursor from "@/components/CustomCursor"
import Sidebar from "@/components/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [enableCustomCursor, setEnableCustomCursor] = useState(false)
  const activePage = pathname.split('/')[2] || 'dashboard'
  
  // Add loading state for transitions
  useEffect(() => {
    // Function to handle route change start
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }
    
    // Function to handle route change complete
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 300) // Slight delay to ensure smooth transition
    }
    
    // Simulate route change events since Next.js App Router doesn't expose them directly
    const originalPush = router.push
    const originalReplace = router.replace
    
    router.push = (...args: Parameters<typeof router.push>) => {
      handleRouteChangeStart()
      return originalPush.apply(router, args)
    }
    
    router.replace = (...args: Parameters<typeof router.replace>) => {
      handleRouteChangeStart()
      return originalReplace.apply(router, args)
    }
    
    // Run once on initial load
    handleRouteChangeComplete()
    
    // Option to enable/disable custom cursor via localStorage
    if (typeof window !== 'undefined') {
      setEnableCustomCursor(localStorage.getItem('enableCustomCursor') === 'true')
    }
    
    return () => {
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])
  
  // Update when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])
  
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Conditional custom cursor */}
      {enableCustomCursor && <CustomCursor />}
      
      {/* Sidebar outside the page transition */}
      <Sidebar activePage={activePage} />
      
      {/* Main content with page transition */}
      <div className="flex-1 flex ml-[300px]">
        {/* Loading overlay with animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 ml-[300px] bg-white bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 border-4 border-[#704ee7] border-t-transparent rounded-full animate-spin mb-4"></div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 100 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-1 bg-[#704ee7] rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  )
} 