import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thalos Prime',
  description: 'Production-ready application with Domain-Driven Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
