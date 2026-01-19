import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if any admins exist
    const existingAdminsCount = await db.admin.count()
    const isFirstAdmin = existingAdminsCount === 0

    if (!isFirstAdmin) {
      // For subsequent admins, require authentication
      const sessionId = request.cookies.get('admin_session')?.value

      if (!sessionId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Verify admin exists and has permission
      const currentAdmin = await db.admin.findUnique({
        where: { id: sessionId }
      })

      if (!currentAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Only superadmin can create new admins
      if (currentAdmin.role !== 'superadmin') {
        return NextResponse.json(
          { error: 'Insufficient permissions. Only superadmins can create new admins.' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const { name, email, password, role = 'admin' } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new admin
    const newAdmin = await db.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role
      }
    })

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
