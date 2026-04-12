import React from 'react'
console.log(React)
export default function Notification({ toast, onClose }) {
  if (!toast) return null

  const { message, type = 'info' } = toast

  return (
    <div className={`notification ${type}`} role="status" aria-live="polite">
      <div className="notification-content">
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={onClose} aria-label="Cerrar">×</button>
      </div>
    </div>
  )
}
