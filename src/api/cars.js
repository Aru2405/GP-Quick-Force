import client from './client';

// Obtener todos los coches
export const getCars = async () => {
  const resp = await client.get('/cars')
  return resp.data
}

// Crear un nuevo coche
export const createCar = async (carData) => {
  return client.post("/cars", carData);
};

// Actualizar un coche existente
export const updateCar = async (id, carData) => {
  return client.put(`/cars/${id}`, carData);
};

// Eliminar un coche
export const deleteCar = async (id) => {
  await client.delete(`/cars/${id}`)
}