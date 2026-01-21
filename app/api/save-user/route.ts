import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { clerkId, email } = await request.json()
    const user = new User({
      clerkId,
      email,
    })
    await user.save()
    return NextResponse.json({ message: 'User saved successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Error saving user:', error)
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 })
  }
}