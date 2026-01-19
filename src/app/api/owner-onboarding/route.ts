import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PGType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      pgName,
      pgType,
      pgAddress,
      pgCity,
      pgState,
      pgPincode,
      capacity,
      existingRooms,
      message
    } = body

    // Validation
    if (!name || !phone || !email || !pgName || !pgType || !pgAddress || !pgCity || !pgState || !pgPincode) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate PG type
    if (!['BOYS', 'GIRLS'].includes(pgType)) {
      return NextResponse.json(
        { error: 'Invalid PG type. Must be BOYS or GIRLS' },
        { status: 400 }
      )
    }

    // Create owner onboarding request
    const onboarding = await db.ownerOnboarding.create({
      data: {
        name,
        phone,
        email,
        pgName,
        pgType: pgType as PGType,
        pgAddress,
        pgCity,
        pgState,
        pgPincode,
        capacity,
        existingRooms,
        message
      }
    })

    return NextResponse.json(
      {
        message: 'Owner onboarding request submitted successfully',
        onboarding: {
          id: onboarding.id,
          name: onboarding.name,
          pgName: onboarding.pgName
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating owner onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to submit onboarding request' },
      { status: 500 }
    )
  }
}
