import api from '../../utils/request'

export const VnpayCreate = async (obj) => {
  const res = await api.post('/vnpay/create',obj);
  return res.data;
};