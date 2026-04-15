import React, { useState, useEffect } from 'react'
import AdminPage from './components/AdminPage'
import LoginForm from './components/LoginForm' // Importamos el formulario que creamos
import UserCarsList from './components/UserCarsList';
import './styles.css'

export default function App() {
  // Estado para saber si el usuario está identificado
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al cargar la app, comprobamos si ya hay un token guardado
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      // Si hay token, asumimos que está logueado (Aitzol podrá mejorar esto luego)
      setUser({ loggedIn: true })
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) return <div className="app-root">Cargando...</div>

  return (
    <div className="app-root">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel Admin — Catálogo de Coches</h1>
        {user && (
          <button className="btn-outline" onClick={handleLogout} style={{ fontSize: '0.8rem' }}>
            Cerrar Sesión
          </button>
        )}
      </header>
      <main>
        {/* LA CLAVE: Si no hay usuario, muestra LoginForm. Si hay, muestra AdminPage */}
        {!user ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AdminPage />
        )}
      </main>
    </div>
  )
}