import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { clerkId, skinId } = await request.json()

    const user = await User.findOne({ clerkId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.inventory.includes(skinId)) {
      user.inventory.push(skinId)
      await user.save()
    }

    return NextResponse.json({ message: 'Skin added to inventory' }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get('clerkId')

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId required' }, { status: 400 })
    }

    const user = await User.findOne({ clerkId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ inventory: user.inventory }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}