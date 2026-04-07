import React from 'react'
import AdminPage from './components/AdminPage'

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Panel Admin — Catálogo de Coches</h1>
      </header>
      <main>
        <AdminPage />
      </main>
    </div>
  )
}
