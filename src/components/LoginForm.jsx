import React, { useState } from 'react'
import client from '../api/client'

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // Nos comunicamos con la ruta del "Cerrojo" que creaste en el Backend
      const response = await client.post('/auth/login', {
        email,
        password
      })

      // Guardamos la llave maestra en el navegador
      localStorage.setItem('token', response.data.token)

      // Avisamos a la aplicación de que hemos entrado con éxito
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user)
      }
    } catch (err) {
      // Si falla (contraseña incorrecta), mostramos tu mensaje de error
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="login-wrapper" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Iniciar Sesión en Quick Force</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}