import api from '../../utils/request'

export const getCategory = async () => {
  const res = await api.get(`/admin/theloai`);
  return res.data;
};
export const getCategorybyId = async (id) => {
  const res = await api.get(`/admin/theloai/${id}`);
  return res.data;
};


export const CreateMovie = async (data) => {
  const res = await api.post(`/admin/theloai`, data);
  return res.data;
};
export const UpdateMovie = async (id, data) => {
  const res = await api.put(`/admin/theloai/${id}`, data);
  return res.data;
};
export const DeleteCategory = async (id) => {
  const res = await api.delete(`/admin/theloai/${id}`);
  return res.data;
};

