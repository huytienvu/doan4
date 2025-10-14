import api from '../../utils/request'

export const getListMovie = async () => {
  const res = await api.get(`/admin/phim`);
  return res.data;
};
export const getMoviebyId = async (id) => {
  const res = await api.get(`/phim/${id}`);
  return res.data;
};


export const CreateMovie = async (data) => {
  const res = await api.post(`/admin/phim`, data);
  return res.data;
};
export const UpdateMovie = async (id, data) => {
  const res = await api.put(`/admin/phim/${id}`, data);
  return res.data;
};

