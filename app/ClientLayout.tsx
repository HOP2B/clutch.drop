'use client'

function Header() {
  return (
    <header style={{ backgroundColor: '#0a091a', padding: '10px 20px', display: 'flex', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', marginRight: '10px' }} />
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
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
