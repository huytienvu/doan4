import api from '../utils/request'

export const getRatingMovie = async (id) => {
  const res = await api.get(`/danhgia/${id}`);
  return res.data;
};
export const CheckRatingMovie = async (obj) => {
  const res = await api.post(`/danhgia/check`,obj);
  return res.data;
};
export const addRatingMovie = async (obj) => {
  const res = await api.post(`/danhgia`,obj);
  return res.data;
};