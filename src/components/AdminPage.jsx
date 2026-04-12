import React, { useState } from 'react'
import { createCar, updateCar } from '../api/cars'
import AdminCarsList from './AdminCarsList'
import CarFormModal from './CarFormModal'
import Notification from './Notification'
console.log(React)

export default function AdminPage() {
  const [listKey, setListKey] = useState(0)
  const [toast, setToast] = useState(null)
  //control del modal: null = creación, objeto = edicion
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)

  const notify = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const triggerReload = () => setListKey(k => k + 1)

  //ABRIR CREACIÓN
  const handleAddCar = () => {
    setSelectedCar(null)
    setIsModalOpen(true)
  }

  //ABRIR EDICION (lo recibe de AdminCarsList)
  const handleEditCar = (car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  //CERRAR MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
  }

  //GUARDAR (CREATE + UPDATE)
  const handleSaveCar = async (carData) => {
    try {
      if (selectedCar) {
        await updateCar(selectedCar.id, carData)
        notify('Vehículo actualizado correctamente', 'success')
      } else {
        await createCar(carData)
        notify('Vehículo creado correctamente', 'success')
      }

      triggerReload()
      handleCloseModal()
    } catch (error) {
      notify('Error al guardar: ' + (error?.message || ''), 'error')
    }
  }

  return (
    <div>
      <Notification toast={toast} onClose={() => setToast(null)} />

      <div className="admin-nav">
        <button className="active">Listado</button>
      </div>

      {/*BOTON ANADIR COCHE */}
      <div className="mb-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#801a33',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '20px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#a02140'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#801a33'}
        >
          + Añadir Vehículo
        </button>
      </div>

      <div className="admin-content">
        <AdminCarsList
          refreshKey={listKey}
          notify={notify}
          onEdit={handleEditCar}
        />
      </div>

      {/*MODAL */}
      {isModalOpen && (
        <CarFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCar}
          car={selectedCar}
        />
      )}
    </div>
  )
}
