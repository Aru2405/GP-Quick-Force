import React, { useEffect, useState } from 'react'
console.log(React)

export default function CarFormModal({ isOpen, onClose, onSave, car }) {
    const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: ''
})

  //Cargar datos en edición
    useEffect(() => {
    if (car) {
        setForm({
        make: car.make || '',
        model: car.model || '',
        year: car.year || '',
        pricePerDay: car.pricePerDay || ''
    })
    } else {
        setForm({
        make: '',
        model: '',
        year: '',
        pricePerDay: ''
        })
    }
}, [car])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

    onSave({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        pricePerDay: Number(form.pricePerDay)
    })
}

if (!isOpen) return null

return (
    <div className="confirm-overlay">
        <div className="confirm-box">
            {/* Titulo */}
            <h2 className="confirm-title">
                {car ? 'Editar vehículo' : 'Añadir vehículo'}
            </h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={car ? 'edit-car' : 'create-car'}>
                <label>Marca</label>
                <input
                    type="text"
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    required
                />

                <label>Modelo</label>
                <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                />

                <label>Año</label>
                <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                />

                <label>Precio por dia (€)</label>
                <input
                    type="number"
                    name="pricePerDay"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    required
                />

                {/* Botones */}
                <div className="form-actions">
                    <button type="button" className="btn-outline" onClick={onClose}>
                        Cancelar
                    </button>

                    <button type="submit" className="btn">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}