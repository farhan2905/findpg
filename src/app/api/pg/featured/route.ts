import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '6'

    const apiUrl = `${process.env.API_BASE_URL}/api/pg/featured?limit=${limit}`
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
    console.error('Error fetching featured PGs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured PGs' },
      { status: 500 }
    )
  }
}
