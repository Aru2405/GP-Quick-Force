require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken') // <--- IMPORTACIÓN CRUCIAL
const carsRepository = require('./repositories/carsRepository')
const authRepository = require('./repositories/authRepository')
const { verifyToken, isAdmin } = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret'

// --- RUTAS DE AUTENTICACIÓN ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await authRepository.register(req.body)
    
    // AUTO-LOGIN: Generamos el token aquí mismo para entrar directo
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '2h' }
    )
    
    res.status(201).json({ token, user })
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
    // Mapeo de errores específicos para lo que me pediste
    if (err.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({ message: 'La cuenta no existe' })
    }
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }
    res.status(401).json({ message: err.message })
  }
})

// --- RUTAS DE COCHES ---
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await carsRepository.findAll()
    res.json(cars)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los vehículos' })
  }
})

app.post('/api/cars', verifyToken, isAdmin, async (req, res) => {
  try {
    const newCar = await carsRepository.create(req.body)
    res.status(201).json(newCar)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.put('/api/cars/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await carsRepository.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.delete('/api/cars/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await carsRepository.deleteById(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`🚀 Servidor GP Quick Force en puerto ${port}`))