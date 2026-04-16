const prisma = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

async function register(data) {
  const { email, password, role } = data

  if (!email || !password) {
    throw new Error('Email y contraseña son obligatorios')
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('El usuario ya existe')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER'
    },
    select: { id: true, email: true, role: true }
  })
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })
  
  // LANZAMOS ERRORES ESPECÍFICOS
  if (!user) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS')
  }

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