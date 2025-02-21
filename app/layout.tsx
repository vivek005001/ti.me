import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

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
        <body className="bg-[#161616] text-white">
          <nav className="p-4 flex justify-end">
            <SignedIn>
              <UserButton afterSignOutUrl="/"/>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal"/>
            </SignedOut>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'