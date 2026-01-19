import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '12'
    const city = searchParams.get('city')
    const sortBy = searchParams.get('sortBy') || 'createdAt'

    const params = new URLSearchParams({
      page,
      limit,
      sortBy
    })

    if (type) {
      params.append('type', type)
    }

    if (city) {
      params.append('city', city)
    }

    const apiUrl = `${process.env.API_BASE_URL}/api/pg/listings?${params.toString()}`
    console.log('Fetching from API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('API response status:', response.status)
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching PG listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PG listings' },
      { status: 500 }
    )
  }
}
