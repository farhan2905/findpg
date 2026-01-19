import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PGType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')?.toUpperCase() as PGType | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const city = searchParams.get('city')
    const sortBy = searchParams.get('sortBy') || 'createdAt'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      active: true
    }

    if (type && (type === 'BOYS' || type === 'GIRLS')) {
      where.type = type
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      }
    }

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'createdAt') {
      orderBy.createdAt = 'desc'
    } else if (sortBy === 'rent') {
      orderBy.rentPlans = {
        rent: 'asc'
      }
    }

    // Fetch PGs with their first image
    const pgs = await db.pG.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: 'asc'
          },
          take: 1
        },
        rentPlans: {
          orderBy: {
            rent: 'asc'
          },
          take: 1
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await db.pG.count({ where })

    return NextResponse.json({
      pgs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching PG listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PG listings' },
      { status: 500 }
    )
  }
}
