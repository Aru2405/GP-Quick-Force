const prisma = require('../db');

class CarsRepository {
  // Obtener todos los coches
  async findAll() {
    return prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Crear un nuevo coche
  async create(data) {
    return prisma.car.create({
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
    return prisma.car.update({
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
    return prisma.car.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = new CarsRepository();