import React, { useEffect, useState } from 'react';
import { getCars } from '../api/cars';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';

const UserCarsList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Para el buscador
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err) {
        setError('No se pudo conectar con el servidor. ¿Has encendido la ballena?');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

//Logica de favoritos
const [favorites, setFavorites] = useState([]) // array de carId
const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
useEffect(() => {
  if (!isLogged) {
    setFavorites([]) // limpiar si se desloguea
    return
  }

  let mounted = true
  const loadFavs = async () => {
    try {
      const data = await getFavorites() // devuelve lista de favoritos con car o ids
      if (!mounted) return
      setFavorites(data.map(f => f.carId ?? f.id))
    } catch (e) { /* ignore */ }
  }
  loadFavs()
  return () => { mounted = false }
}, [isLogged])

const isFavorited = (carId) => favorites.includes(carId)
useEffect(() => {
  const onStorage = (e) => {
    if (e.key === 'token') setIsLogged(!!e.newValue);
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, []);

const toggleFavorite = async (carId) => {
  if (!isLogged) {
    alert('Inicia sesión para guardar favoritos'); // o usar Notification component
    return;
  }
  if (isFavorited(carId)) {
    setFavorites(prev => prev.filter(id => id !== carId));
    try { await removeFavorite(carId) } catch (e) { setFavorites(prev => [carId, ...prev]) }
  } else {
    setFavorites(prev => [carId, ...prev]);
    try { await addFavorite(carId) } catch (e) { setFavorites(prev => prev.filter(id => id !== carId)) }
  }
}
  // Lógica de filtrado: filtramos por marca o modelo mientras escribes
  const filteredByText = cars.filter(car => 
  car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
  car.model.toLowerCase().includes(searchTerm.toLowerCase())
);

// Si está activado "solo favoritos", intersectar con `favorites`
const filteredCars = showFavoritesOnly
  ? filteredByText.filter(car => favorites.includes(car.id))
  : filteredByText;

  if (loading) return <div className="loading">Cargando flota de vehículos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <h1 className="main-title">Encuentra tu próximo coche</h1>

      {/* Buscador: El toque 'Pro' */}
      <div className="search-container" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="Busca por marca o modelo (ej. BMW, Toyota...)" 
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
      {isLogged && (
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <button className={`btn-filter ${showFavoritesOnly ? 'favorited' : ''}`} onClick={() => setShowFavoritesOnly(prev => !prev)} aria-pressed={showFavoritesOnly}>
          {showFavoritesOnly ? 'Ver todos' : 'Ver favoritos'}
        </button>
      </div>
    )}

      <div className="cars-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id} className="car-card">
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
                <button className="btn-details">Reservar ahora</button>
                {isLogged && (
                  <button className={`btn-fav ${isFavorited(car.id) ? 'favorited' : ''}`} onClick={() => toggleFavorite(car.id)}>
                  {isFavorited(car.id) ? 'Eliminar Favorito' : 'Guardar favorito'}
                </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>
            No hemos encontrado ningún coche que coincida con "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCarsList;