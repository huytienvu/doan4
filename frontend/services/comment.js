import api from '../utils/request'

export const getCommentMovie = async (id) => {
  const res = await api.get(`/binhluan/${id}`);
  return res.data;
};
export const addCommentMovie = async (obj) => {
  const res = await api.post(`/binhluan`,obj);
  return res.data;
};