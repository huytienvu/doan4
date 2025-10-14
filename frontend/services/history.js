import api from '../utils/request'
export const getHistoryUser = async (id) => {
  const res = await api.get(`/lichsu/${id}`);
  return res.data;
};
export const createHistory = async (obj) => {
  const res = await api.post(`/lichsu`,obj);
  return res.data;
};