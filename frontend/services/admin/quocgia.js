import api from '../../utils/request'

export const getAllCountry = async () => {
  const res = await api.get('/admin/quocgia');
  return res.data;
};
export const getCountryById = async (id) => {
  const res = await api.get(`/admin/quocgia/${id}`);
  return res.data;
};
export const createCountry = async (obj) => {
  const res = await api.post(`/admin/quocgia`,obj);
  return res.data;
};
export const updateCountry = async (id,obj) => {
  const res = await api.put(`/admin/quocgia/${id}`,obj);
  return res.data;
};