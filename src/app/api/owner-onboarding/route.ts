import { NextRequest, NextResponse } from 'next/server'

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

    const apiUrl = `${process.env.API_BASE_URL}/api/owner-onboarding`
    console.log('Posting to API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      })
    })

    console.log('API response status:', response.status)
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to submit onboarding request' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating owner onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to submit onboarding request' },
      { status: 500 }
    )
  }
}
