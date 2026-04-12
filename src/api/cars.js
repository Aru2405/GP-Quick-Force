import client from './client';

// Obtener coches
export async function getCars() {
  const resp = await client.get('/cars')
  return resp.data
}
// Crear coche
export const createCar = (carData) => {
  return client.post("/cars", carData);
};

// Actualizar coche
export const updateCar = (id, carData) => {
  return client.put(`/cars/${id}`, carData);
};
// Eliminar coche
export async function deleteCar(id) {
  await client.delete(`/cars/${id}`)
}

