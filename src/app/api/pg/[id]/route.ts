import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiUrl = `${process.env.API_BASE_URL}/api/pg/${id}`
    console.log('Fetching from API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('API response status:', response.status)
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'PG not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching PG details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PG details' },
      { status: 500 }
    )
  }
}
