'use client'

import React, { useState } from 'react'

function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <header style={{ backgroundColor: '#0a091a', padding: '10px 20px', display: 'flex', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, borderBottom: '1px solid #333' }}>
      <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', marginRight: '20px' }} />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '14px',
              border: '2px solid #444',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ffd700'
              e.target.style.boxShadow = '0 0 12px rgba(255, 215, 0, 0.3)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#444'
              e.target.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.1)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#666'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#444'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
          />
          <style jsx>{`
            input::placeholder {
              color: #888;
            }
          `}</style>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</a>
        <a href="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', border: '1px solid #6366f1', borderRadius: '4px', transition: 'all 0.3s ease' }}>Log in</a>
        <a href="/signup" style={{ color: 'white', textDecoration: 'none', backgroundColor: '#6366f1', padding: '8px 16px', borderRadius: '4px', transition: 'all 0.3s ease' }}>Sign up</a>
      </nav>
    </header>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <Header onSearch={setSearchQuery} />
      <div style={{ paddingTop: '120px' }}>
        {React.Children.map(children, child => 
          React.isValidElement(child) 
            ? React.cloneElement(child as React.ReactElement<any>, { searchQuery })
            : child
        )}
      </div>
    </>
  )
}
