import React, { useState } from 'react';
import client from '../api/client';

export default function RegisterForm({ onRegisterSuccess, onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await client.post('/auth/register', { email, password });
      
      // Guardamos el token que ahora envía el servidor corregido
      localStorage.setItem('token', response.data.token);
      
      if (onRegisterSuccess) {
        onRegisterSuccess(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="login-wrapper" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2 style={{ color: '#7b1637', textAlign: 'center' }}>Únete a Quick Force</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />
        
        <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        
        <button type="submit" className="btn" style={{ width: '100%', padding: '10px', background: '#7b1637', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registrarse y entrar ahora
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        ¿Ya tienes cuenta? <button onClick={onGoToLogin} style={{ background: 'none', border: 'none', color: '#7b1637', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesión aquí</button>
      </p>
    </div>
  );
}