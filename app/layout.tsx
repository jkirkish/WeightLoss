import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'WeightLoss Journey',
  description: 'Track your weight loss journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
