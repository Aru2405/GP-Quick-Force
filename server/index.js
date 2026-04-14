require('dotenv').config()
const express = require('express')
const cors = require('cors')
const carsRepository = require('./repositories/carsRepository')
// 1. Importar Auth
const authRepository = require('./repositories/authRepository')
const { verifyToken, isAdmin } = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())

// --- RUTAS DE AUTENTICACIÓN ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await authRepository.register(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await authRepository.login(email, password)
    res.json(result)
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
})

// --- RUTAS DE COCHES ---
// Obtener todos los vehículos (Público o solo usuarios logueados, según decidáis. Lo dejamos público por ahora)
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await carsRepository.findAll()
    res.json(cars)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener vehículos' })
  }
})

app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await carsRepository.findById(req.params.id)
    if (!car) return res.status(404).json({ message: 'Vehículo no encontrado' })
    res.json(car)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Crear nuevo vehículo (¡Protegido: Solo ADMIN!)
app.post('/api/cars', verifyToken, isAdmin, async (req, res) => {
  try {
    const newCar = await carsRepository.create(req.body)
    res.status(201).json(newCar)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Actualizar vehículo (¡Protegido: Solo ADMIN!)
app.put('/api/cars/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await carsRepository.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    if (err.message === 'Vehículo no encontrado') {
      return res.status(404).json({ message: err.message })
    }
    res.status(400).json({ message: err.message })
  }
})

// Eliminar vehículo (¡Protegido: Solo ADMIN!)
app.delete('/api/cars/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await carsRepository.deleteById(req.params.id)
    res.status(204).send()
  } catch (err) {
    if (err.message === 'Vehículo no encontrado') {
      return res.status(404).json({ message: err.message })
    }
    res.status(400).json({ message: err.message })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Mock API listening on http://localhost:${port}`))