'use client'

import { ClerkProvider } from '@clerk/nextjs'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header style={{ backgroundColor: '#0a091a', padding: '10px 20px', display: 'flex', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', marginRight: '10px' }} />
            <nav style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
              <a href="login" style={{ color: 'white', textDecoration: 'none' }}>Log In</a>
              <a href="signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</a>
            </nav>
          </header>
          <div style={{ paddingTop: '70px' }}>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}