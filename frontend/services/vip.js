import api from '../utils/request'

export const getGoiVip = async (id) => {
  const res = await api.get(`/goivip`);
  return res.data;
};
