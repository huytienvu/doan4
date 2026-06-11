import api from '../utils/request'

export const getGoiVip = async (id) => {
  const res = await api.get(`/goivip`);
  return res.data;
};
export const Checkvip = async (id) => {
  const res = await api.get(`/user/check/${id}`);
  return res.data;
};
