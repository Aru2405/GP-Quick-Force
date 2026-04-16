import React, { useState, useEffect } from 'react';
import UserCarsList from './components/UserCarsList';
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm'; 
import AdminPage from './components/AdminPage';
import './styles.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('catalog');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setView(userData.role === 'ADMIN' ? 'admin' : 'catalog');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('catalog');
  };

  return (
    <div className="app-root">
      <header className="navbar" style={{ background: '#7b1637', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🚗 GP Quick Force</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          
          {/* Lógica de botones original + NUEVO BOTÓN FAVORITOS */}
          {view === 'catalog' && (
            !user ? (
              <button onClick={() => setView('login')} className="btn-nav">Iniciar Sesión/Registrarse</button>
            ) : (
              <>
                {/* BOTÓN NUEVO SOLAMENTE CUANDO ESTÁ LOGUEADO */}
                <button onClick={() => setView('favorites')} className="btn-nav">Lista de Favoritos ❤️</button>
                
                {user.role === 'ADMIN' && <button onClick={() => setView('admin')} className="btn-nav">Gestionar</button>}
                <button onClick={handleLogout} className="btn-nav logout">Cerrar Sesión</button>
              </>
            )
          )}

          {/* Si estamos en favoritos, permitimos volver al catálogo */}
          {view === 'favorites' && (
            <>
              <button onClick={() => setView('catalog')} className="btn-nav">Ver catálogo completo</button>
              <button onClick={handleLogout} className="btn-nav logout">Cerrar Sesión</button>
            </>
          )}

          {view === 'admin' && (
            <>
              <button onClick={() => setView('catalog')} className="btn-nav">Ver catálogo</button>
              <button onClick={handleLogout} className="btn-nav logout">Cerrar Sesión</button>
            </>
          )}

          {(view === 'login' || view === 'register') && (
            <button onClick={() => setView('catalog')} className="btn-nav">Volver al Catálogo</button>
          )}
        </div>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Usamos el mismo componente para Catálogo y Favoritos filtrando por prop */}
        {view === 'catalog' && (
          <UserCarsList user={user} onAuthRequired={() => setView('login')} />
        )}
        
        {view === 'favorites' && (
          <UserCarsList user={user} onAuthRequired={() => setView('login')} onlyFavorites={true} />
        )}

        {view === 'login' && (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess} 
            onGoToRegister={() => setView('register')} 
          />
        )}
        {view === 'register' && (
          <RegisterForm 
            onRegisterSuccess={handleLoginSuccess} 
            onGoToLogin={() => setView('login')} 
          />
        )}
        {view === 'admin' && user?.role === 'ADMIN' && <AdminPage />}
      </main>
    </div>
  );
}