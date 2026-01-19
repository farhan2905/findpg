import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '6')

    const featuredPGs = await db.pG.findMany({
      where: {
        featured: true,
        active: true
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json(featuredPGs)
  } catch (error) {
    console.error('Error fetching featured PGs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured PGs' },
      { status: 500 }
    )
  }
}
