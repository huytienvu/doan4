import api from '../utils/request'
export const getFavoriteUser = async (id) => {
  const res = await api.get(`/yeuthich/${id}`);
  return res.data;
};
export const createFavorite = async (obj) => {
  const res = await api.post(`/yeuthich`,obj);
  return res.data;
};
export const deleteFavorite = async (user_id,phim_id) => {
  const res = await api.delete(`/yeuthich?user_id=${user_id}&phim_id=${phim_id}`);
  return res.data;
};
export const checkFavorite = async (obj) => {
  const res = await api.post(`/yeuthich/check`,obj);
  return res.data;
};