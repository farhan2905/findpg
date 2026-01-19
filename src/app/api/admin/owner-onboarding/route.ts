import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const requests = await db.ownerOnboarding.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching owner onboarding requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding requests' },
      { status: 500 }
    )
  }
}
