const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class FavoritesRepository {
  async findByUser(userId) {
    return prisma.favorite.findMany({
      where: { userId: Number(userId) },
      include: { car: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async add(userId, carId) {
    return prisma.favorite.create({
      data: { userId: Number(userId), carId: Number(carId) },
      include: { car: true }
    })
  }

  async remove(userId, carId) {
    return prisma.favorite.deleteMany({
      where: { userId: Number(userId), carId: Number(carId) }
    })
  }
}

module.exports = new FavoritesRepository()