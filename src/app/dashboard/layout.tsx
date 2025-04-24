"use client"

import { useState, useEffect } from "react"
import PageTransition from "@/components/PageTransition"
import CustomCursor from "@/components/CustomCursor"
import Sidebar from "@/components/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

type ActivePage = 'dashboard' | 'lessons' | 'achievements' | 'challenges' | 'progress' | 'community'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [enableCustomCursor, setEnableCustomCursor] = useState(false)
  
  // Safely get active page with type assertion
  const getActivePage = (): ActivePage => {
    const page = pathname.split('/')[2]
    const validPages: ActivePage[] = ['dashboard', 'lessons', 'achievements', 'challenges', 'progress', 'community']
    return validPages.includes(page as ActivePage) ? page as ActivePage : 'dashboard'
  }
  
  const activePage = getActivePage()

  // Add loading state for transitions
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }
    
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
    
    // Store original router methods
    const originalPush = router.push
    const originalReplace = router.replace
    
    // Enhanced push method
    router.push = async (...args: Parameters<typeof router.push>) => {
      handleRouteChangeStart()
      try {
        await originalPush.apply(router, args)
      } finally {
        handleRouteChangeComplete()
      }
    }
    
    // Enhanced replace method
    router.replace = async (...args: Parameters<typeof router.replace>) => {
      handleRouteChangeStart()
      try {
        await originalReplace.apply(router, args)
      } finally {
        handleRouteChangeComplete()
      }
    }
    
    // Initial setup
    handleRouteChangeComplete()
    
    if (typeof window !== 'undefined') {
      setEnableCustomCursor(localStorage.getItem('enableCustomCursor') === 'true')
    }
    
    return () => {
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])
  
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {enableCustomCursor && <CustomCursor />}
      
      <Sidebar activePage={activePage} />
      
      <div className="flex-1 flex ml-[300px]">
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