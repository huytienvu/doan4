import api from '../utils/request'

export const getAllActor = async () => {
  const res = await api.get('/dienvien');
  return res.data;
};
export const getActorById = async (id) => {
  const res = await api.get(`/dienvien/${id}`);
  return res.data;
};