import client from './client'

export async function getCars() {
  const resp = await client.get('/cars')
  return resp.data
}

export async function deleteCar(id) {
  await client.delete(`/cars/${id}`)
}

