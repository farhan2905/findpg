import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pg = await db.pG.findUnique({
      where: {
        id,
        active: true
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        videos: {
          orderBy: {
            order: 'asc'
          }
        },
        rentPlans: {
          orderBy: {
            rent: 'asc'
          }
        },
        amenities: true,
        rules: true
      }
    })

    if (!pg) {
      return NextResponse.json(
        { error: 'PG not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pg)
  } catch (error) {
    console.error('Error fetching PG details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PG details' },
      { status: 500 }
    )
  }
}
