import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS Case Opening Project',
  description: 'A Counter-Strike case opening simulator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}