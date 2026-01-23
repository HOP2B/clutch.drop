'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for login logic
    if (email && password) {
      router.push('/')
    } else {
      setError('Please enter email and password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-white text-2xl mb-6 text-center">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  )
}