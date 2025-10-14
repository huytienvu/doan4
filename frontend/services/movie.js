import api from '../utils/request'

export const getListMovie = async () => {
  const res = await api.get(`/phim`);
  return res.data;
};
export const getMoviebyId = async (id) => {
  const res = await api.get(`/phim/${id}`);
  return res.data;
};
export const getMovieCategory = async (id) => {
  const res = await api.get(`/phim/category/${id}`);
  return res.data;
};
export const getMovieLoai = async (loai) => {
  const res = await api.get(`/phim/loai/${loai}`);
  return res.data;
};
export const getMovieCountry = async (country) => {
  const res = await api.get(`/phim/quocgia/${country}`);
  return res.data;
};
export const getMovieNEW= async () => {
  const res = await api.get(`/phim/new`);
  return res.data;
};


// export const CreateMovie = async (data) => {
//   const res = await api.post(`/phim`, data);
//   return res.data;
// };
// export const UpdateMovie = async (id, data) => {
//   const res = await api.put(`/phim/${id}`, data);
//   return res.data;
// };

