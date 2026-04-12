import client from './client';

// Obtener todos los coches
export async function getCars() {
  const resp = await client.get('/cars')
  return resp.data
}

// Crear un nuevo coche
export const createCar = (carData) => {
  return client.post("/cars", carData);
};

// Actualizar un coche existente
export const updateCar = (id, carData) => {
  return client.put(`/cars/${id}`, carData);
};

// Eliminar un coche
export async function deleteCar(id) {
  await client.delete(`/cars/${id}`)
}