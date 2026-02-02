'use client'

import { UserButton, useUser } from '@clerk/nextjs'

function Header() {
  const { isSignedIn, user } = useUser()
  
  return (
    <header style={{ backgroundColor: '#0a091a', padding: '10px 20px', display: 'flex', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', marginRight: '10px' }} />
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
        {!isSignedIn ? (
          <>
            <a href="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', border: '1px solid #6366f1', borderRadius: '4px' }}>Log in</a>
            <a href="/signup" style={{ color: 'white', textDecoration: 'none', backgroundColor: '#6366f1', padding: '8px 16px', borderRadius: '4px' }}>Sign up</a>
          </>
        ) : (
          <UserButton />
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
    <>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        {children}
      </div>
    </>
  )
}
