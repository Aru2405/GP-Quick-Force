import React, { useEffect, useState } from 'react'
import { getCars } from '../api/cars' //
import ConfirmDialog from './ConfirmDialog'

export default function AdminCarsList({ onEdit, onDelete, refreshKey }) {
  const [cars, setCars] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetCar, setTargetCar] = useState(null)

  const load = async () => {
    try {
      const data = await getCars() //
      setCars(data)
    } catch (err) {
      console.error('Error al cargar', err)
    }
  }

  useEffect(() => { load() }, [refreshKey]) // Recarga cuando el padre lo pide

  const openConfirm = (car) => {
    setTargetCar(car)
    setConfirmOpen(true)
  }

  const handleConfirmAction = () => {
    if (targetCar && onDelete) {
      onDelete(targetCar.id) // Llama a la función del padre
    }
    setConfirmOpen(false)
  }

  return (
    <div className="cars-grid">
      {cars.map(car => (
        <article className="car-card" key={car.id}>
          <div className="car-details">
            <h3>{car.make} {car.model}</h3>
            <p>{car.year} • {car.pricePerDay} €/día</p>
            <div className="car-actions">
              <button className="btn" onClick={() => onEdit(car)}>Editar</button>
              <button className="btn delete" onClick={() => openConfirm(car)}>Eliminar</button>
            </div>
          </div>
        </article>
      ))}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        message={targetCar ? `¿Eliminar ${targetCar.make} ${targetCar.model}?` : ''}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}