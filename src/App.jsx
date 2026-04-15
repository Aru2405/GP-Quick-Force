import React, { useState, useEffect } from 'react';
import UserCarsList from './components/UserCarsList';
import LoginForm from './components/LoginForm'; 
import AdminPage from './components/AdminPage';
import './styles.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('catalog');

  // Recuperar sesión básica si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ loggedIn: true }); 
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('catalog');
  };

  return (
    <div className="app-root">
      <header className="navbar" style={{
        background: '#7b1637',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🚗 GP Quick Force</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          
          {/* Lógica de botones según tu petición exacta */}
          
          {/* 1. Si estamos viendo el catálogo */}
          {view === 'catalog' && (
            !user ? (
              // No está logueado: Solo Iniciar Sesión
              <button onClick={() => setView('login')} className="btn-nav">Entrar (Admin)</button>
            ) : (
              // Está logueado: Gestionar y Salir
              <>
                <button onClick={() => setView('admin')} className="btn-nav">Gestionar</button>
                <button onClick={handleLogout} className="btn-nav logout">Salir</button>
              </>
            )
          )}

          {/* 2. Si estamos en la pantalla de Gestionar (Admin) */}
          {view === 'admin' && (
            <>
              <button onClick={() => setView('catalog')} className="btn-nav">Ver catálogo</button>
              <button onClick={handleLogout} className="btn-nav logout">Salir</button>
            </>
          )}

          {/* 3. Si estamos en el Login (Para poder volver atrás) */}
          {view === 'login' && (
            <button onClick={() => setView('catalog')} className="btn-nav">Volver al Catálogo</button>
          )}
        </div>
      </header>

      <main style={{ padding: '20px' }}>
        {view === 'catalog' && <UserCarsList />}
        {view === 'login' && !user && <LoginForm onLoginSuccess={handleLoginSuccess} />}
        {view === 'admin' && user && <AdminPage />}
      </main>

      <footer className="footer">
        &copy; 2026 GP Quick Force - Proyecto Concesionario
      </footer>
    </div>
  );
}