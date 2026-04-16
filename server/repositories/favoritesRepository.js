const prisma = require('../db')

class FavoritesRepository {
  async findByUser(userId) {
    return prisma.favorite.findMany({
      where: { userId: Number(userId) },
      include: { car: true }
    })
  }

  async add(userId, carId) {
    return prisma.favorite.create({
      data: { userId: Number(userId), carId: Number(carId) }
    })
  }

  async remove(userId, carId) {
    return prisma.favorite.deleteMany({
      where: { userId: Number(userId), carId: Number(carId) }
    })
  }
}

module.exports = new FavoritesRepository()