'use client'
import type React from "react"
import "./globals.css"
import { ClerkProvider, SignedIn } from '@clerk/nextjs'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import BackgroundBlobs from './components/BackgroundBlobs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          />
        </head>
        <body className="bg-black text-white relative overflow-x-hidden">
          <BackgroundBlobs />
          {/* Conditionally render NavBar and Sidebar with animations */}
          {pathname !== '/' && (
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 left-0 right-0 z-50"
            >
              <NavBar />
            </motion.div>
          )}
          {pathname !== '/' && (
            <SignedIn>
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 z-40"
              >
                <Sidebar />
              </motion.div>
            </SignedIn>
          )}
          <motion.main
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={pathname !== '/' ? "ml-64 mt-16 relative z-10" : "relative z-10"}
          >
            {children}
          </motion.main>
        </body>
      </html>
    </ClerkProvider>
  )
}

import './globals.css'