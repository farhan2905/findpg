import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const pgs = await db.pG.findMany({
      include: {
        owner: true,
        images: {
          take: 1
        },
        rentPlans: {
          take: 1,
          orderBy: {
            rent: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(pgs)
  } catch (error) {
    console.error('Error fetching admin PGs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PG listings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, address, city, state, pincode, latitude, longitude, ownerId } = body

    // Validation
    if (!title || !description || !type || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Title, description, type, address, city, state, and pincode are required' },
        { status: 400 }
      )
    }

    // Validate PG type
    if (!['BOYS', 'GIRLS'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid PG type. Must be BOYS or GIRLS' },
        { status: 400 }
      )
    }

    const pg = await db.pG.create({
      data: {
        title,
        description,
        type,
        address,
        city,
        state,
        pincode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        ownerId: ownerId || null,
        featured: false,
        active: true
      },
      include: {
        owner: true
      }
    })

    return NextResponse.json(
      {
        message: 'PG created successfully',
        pg
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating PG:', error)
    return NextResponse.json(
      { error: 'Failed to create PG' },
      { status: 500 }
    )
  }
}
