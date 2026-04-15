import React, { useEffect, useState } from 'react';
import { getCars } from '../api/cars';

const UserCarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err) {
        setError('Error al cargar los vehículos. ¿Está el servidor encendido?');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <div className="loading">Cargando catálogo...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <h1 className="main-title">Nuestro Concesionario</h1>
      <div className="cars-grid">
        {cars.length === 0 ? (
          <p>No hay vehículos disponibles en este momento.</p>
        ) : (
          cars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image-container">
                {/* Si no hay imagen, ponemos una por defecto */}
                <img 
                  src={car.image || 'https://via.placeholder.com/400x250?text=Sin+Imagen'} 
                  alt={`${car.brand} ${car.model}`} 
                  className="car-image"
                />
              </div>
              <div className="car-info">
                <h2 className="car-name">{car.brand} {car.model}</h2>
                <div className="car-details">
                  <span className="car-year">{car.year}</span>
                  <span className="car-price">{car.price.toLocaleString()} €</span>
                </div>
                <button className="btn-details">Ver detalles</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserCarsList;