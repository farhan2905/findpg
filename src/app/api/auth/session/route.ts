import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin_session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Verify admin exists
    const admin = await db.admin.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      admin
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
