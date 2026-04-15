const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Limpiando y sembrando base de datos...');

  // 1. Borramos todo para evitar duplicados y errores de clave única
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creamos el usuario Admin con la contraseña encriptada
  // Esto es lo que permite que el login funcione de verdad
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('supersecreto', salt);

  await prisma.user.create({
    data: {
      email: 'jefe@concesionario.com',
      password: hashedPassword,
      role: 'ADMIN' // Usamos el enum definido en vuestro schema
    }
  });

  console.log('✅ Usuario Admin creado: jefe@concesionario.com');

  // 3. Creamos los coches iniciales respetando vuestro modelo
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
    }),

    prisma.car.create({
      data: {
        make: 'BMW',
        model: 'X4',
        year: 2024,
        pricePerDay: 130.0
      }
    })
  ]);

  console.log(`✅ Base de datos lista con ${cars.length} coches.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error al sembrar la base de datos:', e);
    await prisma.$disconnect();
    process.exit(1);
    });
