import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const owners = await db.owner.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(owners)
  } catch (error) {
    console.error('Error fetching owners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch owners' },
      { status: 500 }
    )
  }
}
