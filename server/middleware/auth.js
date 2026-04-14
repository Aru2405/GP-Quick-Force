const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

// Middleware para verificar que el usuario está logueado
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' })
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified // Guardamos los datos del usuario en la petición
    next()
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' })
  }
}

// Middleware para verificar si es Administrador
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    next()
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' })
  }
}

module.exports = {
  verifyToken,
  isAdmin
}