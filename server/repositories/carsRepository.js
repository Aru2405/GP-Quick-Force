const prisma = require('../db')

/**
 * Validar datos de un vehículo
 */
function validateCarData(data) {
  const { make, model, year, pricePerDay } = data

  if (!make || typeof make !== 'string' || make.trim() === '') {
    throw new Error('Marca (make) es requerida')
  }

  if (!model || typeof model !== 'string' || model.trim() === '') {
    throw new Error('Modelo (model) es requerido')
  }

  const yearNum = Number(year)
  if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
    throw new Error('Año debe ser un número válido entre 1900 y ' + new Date().getFullYear())
  }

  const priceNum = Number(pricePerDay)
  if (pricePerDay === undefined || isNaN(priceNum) || priceNum < 0) {
    throw new Error('Precio por día debe ser un número positivo')
  }

  return {
    make: make.trim(),
    model: model.trim(),
    year: yearNum,
    pricePerDay: priceNum
  }
}

/**
 * Obtener todos los vehículos
 */
async function findAll() {
  return await prisma.car.findMany({
    orderBy: { id: 'asc' }
  })
}

/**
 * Obtener vehículo por ID
 */
async function findById(id) {
  const idNum = Number(id)
  if (isNaN(idNum)) {
    throw new Error('ID inválido')
  }
  return await prisma.car.findUnique({
    where: { id: idNum }
  })
}

/**
 * Crear nuevo vehículo
 */
async function create(data) {
  const validatedData = validateCarData(data)

  return await prisma.car.create({
    data: validatedData
  })
}

/**
 * Actualizar vehículo
 */
async function update(id, data) {
  const car = await findById(id)
  if (!car) {
    throw new Error('Vehículo no encontrado')
  }

  // Validar solo los campos que se envían
  const updateData = {}
  if (data.make !== undefined) {
    if (typeof data.make !== 'string' || data.make.trim() === '') {
      throw new Error('Marca (make) inválida')
    }
    updateData.make = data.make.trim()
  }

  if (data.model !== undefined) {
    if (typeof data.model !== 'string' || data.model.trim() === '') {
      throw new Error('Modelo (model) inválido')
    }
    updateData.model = data.model.trim()
  }

  if (data.year !== undefined) {
    const yearNum = Number(data.year)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      throw new Error('Año debe ser un número válido entre 1900 y ' + new Date().getFullYear())
    }
    updateData.year = yearNum
  }

  if (data.pricePerDay !== undefined) {
    const priceNum = Number(data.pricePerDay)
    if (isNaN(priceNum) || priceNum < 0) {
      throw new Error('Precio por día debe ser un número positivo')
    }
    updateData.pricePerDay = priceNum
  }

  return await prisma.car.update({
    where: { id: Number(id) },
    data: updateData
  })
}

/**
 * Eliminar vehículo
 */
async function deleteById(id) {
  const car = await findById(id)
  if (!car) {
    throw new Error('Vehículo no encontrado')
  }

  return await prisma.car.delete({
    where: { id: Number(id) }
  })
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
  validateCarData
}
