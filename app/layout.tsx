import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider, SignedIn } from '@clerk/nextjs'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'

export const metadata: Metadata = {
  title: "TimeCapsuleConn",
  description: "Share your memories",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <body className="bg-black text-white">
          <NavBar />
          <SignedIn>
            <Sidebar />
          </SignedIn>
          <main className="ml-64">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

import './globals.css'