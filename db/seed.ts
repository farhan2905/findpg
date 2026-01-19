import { db } from '@/lib/db'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Check if admin already exists
    const existingAdmins = await db.admin.count()

    if (existingAdmins > 0) {
      console.log('✋ Admin already exists. Skipping seeding...')
      console.log(`📊 Current Admins: ${existingAdmins}`)
      console.log('\n💡 To add the first admin, use the backend query or reset the database first.')
      return
    }

    // Create the first Super Admin
    console.log('🔐 Creating first super admin...')
    const bcrypt = require('bcryptjs')

    const superAdmin = await db.admin.create({
      data: {
        name: 'Super Admin',
        email: 'admin@findpg.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'superadmin'
      }
    })

    console.log('✅ Created first super admin')
    console.log('🔑 Admin Credentials:')
    console.log(`   Email: ${superAdmin.email} | Password: admin123 (Super Admin)`)
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Admins: 1`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
