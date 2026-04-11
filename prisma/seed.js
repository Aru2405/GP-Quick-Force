const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing cars
  await prisma.car.deleteMany()

  // Create sample cars
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        pricePerDay: 35.5
      }
    }),
    prisma.car.create({
      data: {
        make: 'Ford',
        model: 'Focus',
        year: 2019,
        pricePerDay: 30.0
      }
    }),
    prisma.car.create({
      data: {
        make: 'Seat',
        model: 'Ibiza',
        year: 2021,
        pricePerDay: 32.0
      }
    })
  ])

  console.log(`✅ Seeded ${cars.length} cars`)
  console.log(cars)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
