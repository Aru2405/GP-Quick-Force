import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
console.log(React)

const root = document.getElementById('root')
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
