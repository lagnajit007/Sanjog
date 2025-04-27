"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import PageTransition from "@/components/PageTransition"
import CustomCursor from "@/components/CustomCursor"
import Sidebar from "@/components/sidebar"
import Loader from "@/components/Loader"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

type ActivePage = 'dashboard' | 'lessons' | 'achievements' | 'challenges' | 'progress' | 'community'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [enableCustomCursor, setEnableCustomCursor] = useState(false)
  const previousPathname = useRef(pathname)
  
  // Safely get active page with type assertion
  const getActivePage = (): ActivePage => {
    const page = pathname.split('/')[2]
    const validPages: ActivePage[] = ['dashboard', 'lessons', 'achievements', 'challenges', 'progress', 'community']
    return validPages.includes(page as ActivePage) ? page as ActivePage : 'dashboard'
  }
  
  const activePage = getActivePage()

  // Initialize custom cursor preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEnableCustomCursor(localStorage.getItem('enableCustomCursor') === 'true')
    }
  }, [])

  // Handle navigation loading state via pathname changes
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Only show loader for navigation within dashboard sections
      if (previousPathname.current.startsWith('/dashboard') && pathname.startsWith('/dashboard')) {
        setIsLoading(true)
        
        // Hide loader after a short delay
        const timer = setTimeout(() => {
          setIsLoading(false)
        }, 500)
        
        return () => clearTimeout(timer)
      }
      
      // Update the ref
      previousPathname.current = pathname
    }
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
                <Loader color="#704ee7" />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="h-1 bg-[#704ee7] rounded-full mt-4"
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