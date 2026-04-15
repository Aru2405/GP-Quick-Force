const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CarsRepository {
  // Obtener todos los coches
  async findAll() {
    return await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Crear un nuevo coche
  async create(data) {
    return await prisma.car.create({
      data: {
        make: data.make,
        model: data.model,
        year: Number(data.year),
        pricePerDay: Number(data.pricePerDay),
        image: data.image
      }
    });
  }

  // Actualizar un coche existente
  async update(id, data) {
    return await prisma.car.update({
      where: { id: Number(id) },
      data: {
        make: data.make,
        model: data.model,
        year: Number(data.year),
        pricePerDay: Number(data.pricePerDay),
        image: data.image
      }
    });
  }

  // ELIMINAR: Aseguramos que el nombre sea deleteById
  async deleteById(id) {
    return await prisma.car.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = new CarsRepository();