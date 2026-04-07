import React, { useState } from 'react'
import AdminCarsList from './AdminCarsList'
import Notification from './Notification'

export default function AdminPage() {
  const [listKey, setListKey] = useState(0)
  const [toast, setToast] = useState(null)

  const notify = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const triggerReload = () => setListKey(k => k + 1)

  return (
    <div>
      <Notification toast={toast} onClose={() => setToast(null)} />

      <div className="admin-nav">
        <button className="active">Listado</button>
      </div>

      <div className="admin-content">
        <AdminCarsList refreshKey={listKey} notify={notify} />
      </div>
    </div>
  )
}
