import api from '../utils/request'

export const getAllCategory = async () => {
  const res = await api.get('/theloai');
  return res.data;
};
export const getCategoryById = async (id) => {
  const res = await api.get(`/theloai/${id}`);
  return res.data;
};