import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pgId, name, phone, email, message, isCommon = false } = body

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone, and message are required' },
        { status: 400 }
      )
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiry = await db.inquiry.create({
      data: {
        name,
        phone,
        email,
        message,
        isCommon,
        pgId: pgId || null
      }
    })

    return NextResponse.json(
      {
        message: 'Inquiry submitted successfully',
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          message: inquiry.message
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
