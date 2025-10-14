import api from '../utils/request'

export const apilogin = async (obj) => {
  const res = await api.post('/user/login',obj);
  return res.data;
};