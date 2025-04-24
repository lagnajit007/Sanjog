"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.25, 
            ease: "easeOut"
          }
        }}
        exit={{ 
          opacity: 0,
          y: -10,
          transition: { 
            duration: 0.15, 
            ease: "easeIn"
          }
        }}
        className="flex-1 w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 