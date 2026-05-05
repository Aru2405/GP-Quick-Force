import client from './client'

export const getFavorites = async () => {
  const response = await client.get('/favorites');
  return response.data;
};

export const addFavorite = async (carId) => {
  const response = await client.post('/favorites', { carId });
  return response.data;
};

export const removeFavorite = async (carId) => {
  const response = await client.delete(`/favorites/${carId}`);
  return response.data;
};