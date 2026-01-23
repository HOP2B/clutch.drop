'use client'

import { ClerkProvider, useUser, SignOutButton } from '@clerk/nextjs'

function Header() {
  const { user } = useUser()

  return (
    <header style={{ backgroundColor: '#0a091a', padding: '10px 20px', display: 'flex', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', marginRight: '10px' }} />
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <a href="profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</a>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
            <SignOutButton>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}>
                Log Out
              </button>
            </SignOutButton>
          </>
        ) : (
          <>
            <a href="login" style={{ color: 'white', textDecoration: 'none' }}>Log In</a>
            <a href="signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</a>
          </>
        )}
      </nav>
    </header>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div style={{ paddingTop: '70px' }}>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}