import React, { useEffect, useState } from 'react';

export default function CarFormModal({ isOpen, onClose, onSave, car }) {
    const [form, setForm] = useState({
        make: '',
        model: '',
        year: '',
        pricePerDay: '',
        image: ''
    });

    useEffect(() => {
        if (car) {
            setForm({
                make: car.make || '',
                model: car.model || '',
                year: car.year || '',
                pricePerDay: car.pricePerDay || '',
                image: car.image || ''
            });
        } else {
            setForm({
                make: '',
                model: '',
                year: '',
                pricePerDay: '',
                image: ''
            });
        }
    }, [car, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación de seguridad para que el servidor no explote
        const cleanData = {
            make: form.make,
            model: form.model,
            year: Number(form.year),
            pricePerDay: Number(form.pricePerDay),
            image: form.image ? form.image.trim() : ''
        };

        onSave(cleanData);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                width: '400px', color: '#333', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ color: '#7b1637', marginBottom: '20px' }}>
                    {car ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Marca</label>
                        <input 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            type="text" 
                            value={form.make} 
                            onChange={(e) => setForm({...form, make: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Modelo</label>
                        <input 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            type="text" 
                            value={form.model} 
                            onChange={(e) => setForm({...form, model: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Año</label>
                            <input 
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                type="number" 
                                value={form.year} 
                                onChange={(e) => setForm({...form, year: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold' }}>Precio/Día</label>
                            <input 
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                type="number" 
                                step="0.01" 
                                value={form.pricePerDay} 
                                onChange={(e) => setForm({...form, pricePerDay: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>URL Imagen (Google - Copiar dirección de imagen)</label>
                        <input 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            type="text" 
                            placeholder="https://.../foto.jpg"
                            value={form.image} 
                            onChange={(e) => setForm({...form, image: e.target.value})} 
                        />
                        {form.image && (
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <img 
                                    src={form.image} 
                                    alt="Vista previa" 
                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=URL+Invalida'}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button 
                            type="button" 
                            onClick={onClose}
                            style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc' }}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            style={{ 
                                padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', 
                                backgroundColor: '#7b1637', color: 'white', border: 'none' 
                            }}
                        >
                            {car ? 'Guardar' : 'Añadir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}