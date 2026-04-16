import React, { useState } from 'react'
import client from '../api/client'

export default function LoginForm({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await client.post('/auth/login', {
        email,
        password
      })

      localStorage.setItem('token', response.data.token)

      if (onLoginSuccess) {
        onLoginSuccess(response.data.user)
      }
    } catch (err) {
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

        <button type="submit" className="btn" style={{ width: '100%', padding: '10px', backgroundColor: '#7b1637', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        ¿No tienes cuenta todavía? {' '}
        <span 
          onClick={onGoToRegister} 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  )
}