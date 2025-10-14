import api from '../utils/request'

export const getAllCountry = async () => {
  const res = await api.get('/quocgia');
  return res.data;
};
export const getCountryById = async (id) => {
  const res = await api.get(`/quocgia/${id}`);
  return res.data;
};