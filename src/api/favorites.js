import client from './client'

export const getFavorites = async () => (await client.get('/favorites')).data
export const addFavorite = async (carId) => (await client.post('/favorites', { carId })).data
export const removeFavorite = async (carId) => (await client.delete(`/favorites/${carId}`))