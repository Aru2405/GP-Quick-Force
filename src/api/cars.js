import client from './client'

export async function getCars() {
  const resp = await client.get('/cars')
  return resp.data
}

export async function getCar(id) {
  const resp = await client.get(`/cars/${id}`)
  return resp.data
}

export async function createCar(carData) {
  const resp = await client.post('/cars', carData)
  return resp.data
}

export async function updateCar(id, carData) {
  const resp = await client.put(`/cars/${id}`, carData)
  return resp.data
}

export async function deleteCar(id) {
  await client.delete(`/cars/${id}`)
}

