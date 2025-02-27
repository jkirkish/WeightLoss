const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const userEmail = 'kirkish.2@gmail.com' // or any email you want to make admin
  
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        role: 'ADMIN'
      }
    })
    
    console.log(`User ${updatedUser.email} has been set as admin`)
  } catch (error) {
    console.error('Error setting admin:', error)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 