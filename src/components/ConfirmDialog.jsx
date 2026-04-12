import React from 'react'
console.log(React)

export default function ConfirmDialog({ open, title = 'Confirmar', message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-box" role="document">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-outline delete" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}
