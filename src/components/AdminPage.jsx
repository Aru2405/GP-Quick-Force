import React, { useState } from 'react'
import { createCar, updateCar, deleteCar } from '../api/cars' //
import AdminCarsList from './AdminCarsList'
import CarFormModal from './CarFormModal'
import Notification from './Notification'

export default function AdminPage() {
  const [listKey, setListKey] = useState(0)
  const [toast, setToast] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)

  const notify = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const triggerReload = () => setListKey(k => k + 1)

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  // FUNCIÓN DE ELIMINAR CENTRALIZADA
  const handleDeleteCar = async (id) => {
    try {
      await deleteCar(id) //
      notify('Vehículo eliminado correctamente', 'success')
      triggerReload() // Esto obliga a la lista a refrescarse
    } catch (error) {
      const msg = error.response?.data?.message || error.message
      notify('Error al eliminar: ' + msg, 'error')
    }
  }

  const handleSaveCar = async (carData) => {
    try {
      if (selectedCar) {
        await updateCar(selectedCar.id, carData) //
        notify('Vehículo actualizado', 'success')
      } else {
        await createCar(carData) //
        notify('Vehículo creado', 'success')
      }
      triggerReload()
      setIsModalOpen(false)
    } catch (error) {
      notify('Error al guardar: ' + (error.response?.data?.message || error.message), 'error')
    }
  }

  return (
    <div>
      <Notification toast={toast} onClose={() => setToast(null)} />
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => { setSelectedCar(null); setIsModalOpen(true); }}
          className="btn-primary"
          style={{ backgroundColor: '#801a33', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Añadir Vehículo
        </button>
      </div>

      <AdminCarsList
        refreshKey={listKey}
        onEdit={handleEditCar}
        onDelete={handleDeleteCar} // Le pasamos la función al hijo
      />

      {isModalOpen && (
        <CarFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCar}
          car={selectedCar}
        />
      )}
    </div>
  )
}