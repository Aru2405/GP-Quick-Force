require('dotenv').config()
const express = require('express')
const cors = require('cors')
const carsRepository = require('./repositories/carsRepository')

const app = express()
app.use(cors())
app.use(express.json())

// GET /api/cars - Obtener todos los vehículos
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await carsRepository.findAll()
    res.json(cars)
  } catch (err) {
    console.error('Error fetching cars:', err)
    res.status(500).json({ message: 'Error al obtener vehículos' })
  }
})

// GET /api/cars/:id - Obtener vehículo por ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await carsRepository.findById(req.params.id)
    if (!car) return res.status(404).json({ message: 'Vehículo no encontrado' })
    res.json(car)
  } catch (err) {
    console.error('Error fetching car:', err)
    res.status(400).json({ message: err.message })
  }
})

// POST /api/cars - Crear nuevo vehículo
app.post('/api/cars', async (req, res) => {
  try {
    const newCar = await carsRepository.create(req.body)
    res.status(201).json(newCar)
  } catch (err) {
    console.error('Error creating car:', err)
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/cars/:id - Actualizar vehículo
app.put('/api/cars/:id', async (req, res) => {
  try {
    const updated = await carsRepository.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    console.error('Error updating car:', err)
    if (err.message === 'Vehículo no encontrado') {
      return res.status(404).json({ message: err.message })
    }
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/cars/:id - Eliminar vehículo
app.delete('/api/cars/:id', async (req, res) => {
  try {
    await carsRepository.deleteById(req.params.id)
    res.status(204).send()
  } catch (err) {
    console.error('Error deleting car:', err)
    if (err.message === 'Vehículo no encontrado') {
      return res.status(404).json({ message: err.message })
    }
    res.status(400).json({ message: err.message })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Mock API listening on http://localhost:${port}`))
