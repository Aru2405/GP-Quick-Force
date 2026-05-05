const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

if (JWT_SECRET === 'fallback_secret') {
    console.warn('⚠️ ADVERTENCIA: Usando clave JWT de respaldo. ¡Asegúrate de configurar JWT_SECRET en producción!')
}
// Middleware para verificar que el usuario está logueado
const verifyToken = (req, res, next) => {
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
    console.error(`🔒 Rechazo JWT: ${error.message}`)
    res.status(403).json({ message: 'Token inválido o expirado.' })
  }
}

// Middleware para verificar si es Administrador
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Acceso denegado. Usuario no autenticado.' })
  }
  if (req.user.role === 'ADMIN') {
    next()
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' })
  }
}

module.exports = {
  verifyToken,
  isAdmin
}