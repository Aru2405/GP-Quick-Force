import React, { useEffect, useState } from 'react'
import { getCars, deleteCar } from '../api/cars'
import ConfirmDialog from './ConfirmDialog'

export default function AdminCarsList({ onEdit, refreshKey, notify }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetCar, setTargetCar] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCars()
      setCars(data)
    } catch (err) {
      setError(err?.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof refreshKey !== 'undefined') load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  const openConfirm = (car) => {
    setTargetCar(car)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!targetCar) return
    setConfirmOpen(false)
    try {
      await deleteCar(targetCar.id)
      setCars(prev => prev.filter(c => c.id !== targetCar.id))
      notify && notify('Vehículo eliminado correctamente', 'success')
    } catch (err) {
      notify && notify('Error al eliminar: ' + (err?.message || ''), 'error')
    } finally {
      setTargetCar(null)
    }
  }

  return (
    <section className="admin-list premium">
      <div className="toolbar">
        <button className="btn" onClick={load}>Refrescar</button>
      </div>

      {loading && <p className="muted">Cargando vehículos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="cars-grid">
            {cars.map(car => (
            <article className="car-card" key={car.id}>
              <div className="car-hero" aria-hidden="true">
                <div className="car-hero-title">{car.make} {car.model}</div>
              </div>
              <div className="car-details">
                <h3 className="car-title">{car.make} {car.model}</h3>
                <p className="car-meta">{car.year} • {Number(car.pricePerDay).toFixed(2)} €/día</p>
                <div className="car-actions">
                  {onEdit && <button className="btn" onClick={() => onEdit(car)}>Editar</button>}
                  <button className="btn btn-outline delete" onClick={() => openConfirm(car)}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}

          {cars.length === 0 && (
            <div className="no-items">No hay vehículos.</div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        message={targetCar ? `¿Eliminar ${targetCar.make} ${targetCar.model}? Esta acción no se puede deshacer.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  )
}
