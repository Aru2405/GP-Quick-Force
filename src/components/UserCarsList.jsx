import React, { useEffect, useState } from 'react';
import { getCars } from '../api/cars';
import client from '../api/client'; // Importamos para los favoritos

const UserCarsList = ({ user, onAuthRequired, onlyFavorites = false }) => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]); // Array de IDs de favoritos
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData = await getCars();
        setCars(carsData);

        // Si hay usuario, cargamos sus favoritos reales de la DB
        if (user) {
          const favsResponse = await client.get('/favorites');
          setFavorites(favsResponse.data.map(f => f.carId));
        }
      } catch (err) {
        setError('No se pudo conectar con el servidor. ¿Has encendido la ballena?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Lógica de Portero para Reservar y Corazón
  const handleProtectedAction = (actionFn) => {
    if (!user) {
      onAuthRequired();
    } else {
      actionFn();
    }
  };

  const toggleFavorite = async (carId) => {
    try {
      if (favorites.includes(carId)) {
        await client.delete(`/favorites/${carId}`);
        setFavorites(favorites.filter(id => id !== carId));
      } else {
        await client.post('/favorites', { carId });
        setFavorites([...favorites, carId]);
      }
    } catch (err) {
      console.error("Error al actualizar favoritos", err);
    }
  };

  // Lógica de filtrado doble: Buscador + Si estamos en vista Favoritos
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const isFav = onlyFavorites ? favorites.includes(car.id) : true;
    return matchesSearch && isFav;
  });

  if (loading) return <div className="loading">Cargando flota de vehículos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <h1 className="main-title">
        {onlyFavorites ? "Tus coches favoritos ❤️" : "Encuentra tu próximo coche"}
      </h1>

      <div className="search-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="Busca por marca o modelo..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 20px',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '25px',
            border: '2px solid #7b1637',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <div className="cars-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id} className="car-card" style={{ position: 'relative' }}>
              
              {/* EL CORAZÓN: Portero incluido */}
              <button 
                onClick={() => handleProtectedAction(() => toggleFavorite(car.id))}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255,255,255,0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  zIndex: 1
                }}
              >
                {favorites.includes(car.id) ? '❤️' : '🤍'}
              </button>

              <div className="car-image-container">
                <img 
                  src={car.image || `https://via.placeholder.com/400x250?text=${car.make}+${car.model}`} 
                  alt={car.model} 
                  className="car-image"
                />
              </div>
              <div className="car-info">
                <h2 className="car-name">{car.make} {car.model}</h2>
                <div className="car-details">
                  <span className="car-year">Año: {car.year}</span>
                  <span className="car-price">{car.pricePerDay} €/día</span>
                </div>
                
                {/* Botón Reservar con el mismo portero */}
                <button 
                  className="btn-details"
                  onClick={() => handleProtectedAction(() => alert(`Reserva realizada para: ${car.make}`))}
                >
                  Reservar ahora
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>
            {onlyFavorites ? "Aún no tienes favoritos guardados." : `No hay resultados para "${searchTerm}".`}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCarsList;