import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pg = await db.pG.findUnique({
      where: { id },
      include: {
        owner: true,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { featured, active, title, description, type, address, city, state, pincode, latitude, longitude, ownerId } = body

    const updateData: any = {}
    if (typeof featured === 'boolean') updateData.featured = featured
    if (typeof active === 'boolean') updateData.active = active
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type) updateData.type = type
    if (address) updateData.address = address
    if (city) updateData.city = city
    if (state) updateData.state = state
    if (pincode) updateData.pincode = pincode
    if (latitude !== undefined) updateData.latitude = latitude
    if (longitude !== undefined) updateData.longitude = longitude
    if (ownerId !== undefined) updateData.ownerId = ownerId

    const pg = await db.pG.update({
      where: { id },
      data: updateData,
      include: {
        owner: true
      }
    })

    return NextResponse.json(pg)
  } catch (error) {
    console.error('Error updating PG:', error)
    return NextResponse.json(
      { error: 'Failed to update PG' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.pG.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'PG deleted successfully' })
  } catch (error) {
    console.error('Error deleting PG:', error)
    return NextResponse.json(
      { error: 'Failed to delete PG' },
      { status: 500 }
    )
  }
}
