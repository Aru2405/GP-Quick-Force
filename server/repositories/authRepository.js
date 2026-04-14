const prisma = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

async function register(data) {
  const { email, password, role } = data

  if (!email || !password) {
    throw new Error('Email y contraseña son obligatorios')
  }

  // Comprobar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('El usuario ya existe')
  }

  // Encriptar la contraseña (Cerrojo)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crear el usuario. Por defecto será USER, a menos que se especifique ADMIN
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER'
    },
    select: { id: true, email: true, role: true } // No devolvemos la contraseña
  })
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  // Comparar la contraseña encriptada
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Credenciales inválidas')
  }

  // Generar el Token (JWT)
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  )

  return { token, user: { id: user.id, email: user.email, role: user.role } }
}

module.exports = {
  register,
  login
}