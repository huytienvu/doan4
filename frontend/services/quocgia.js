import api from '../utils/request'

export const getAllCountry = async () => {
  const res = await api.get('/quocgia');
  return res.data;
};
export const getCountryById = async (id) => {
  const res = await api.get(`/quocgia/${id}`);
  return res.data;
};
export const createCountry = async (obj) => {
  const res = await api.post(`/quocgia`,obj);
  return res.data;
};
export const updateCountry = async (id,obj) => {
  const res = await api.put(`/quocgia/${id}`,obj);
  return res.data;
};