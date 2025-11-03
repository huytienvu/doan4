import api from '../utils/request'

export const getAllActor = async () => {
  const res = await api.get('/dienvien');
  return res.data;
};
export const getActorById = async (id) => {
  const res = await api.get(`/dienvien/${id}`);
  return res.data;
};
export const createActor = async (obj) => {
  const res = await api.post(`/dienvien`,obj);
  return res.data;
};
export const updateActor = async (id,obj) => {
  const res = await api.put(`/dienvien/${id}`,obj);
  return res.data;
};
export const Search_actor = async (key,page_number=1,page_size=20) => {
  const res = await api.get(`/dienvien/search?key=${key}&page_number=${page_number}&page_size=20`);
  return res.data;
};
export const GetphimbyActor = async (id) => {
  const res = await api.get(`/dienvien/getphim/${id}`);
  return res.data;
};