import api from '../utils/request'

export const getListMovie = async () => {
  const res = await api.get(`/phim`);
  return res.data;
};
export const getMoviebyId = async (id) => {
  const res = await api.get(`/phim/${id}`);
  return res.data;
};
export const getMovieCategory = async (id,page_number) => {
  const res = await api.get(`/phim/category?id=${id}&page_number=${page_number}&page_size=24`);
  return res.data;
};
export const getMovieLoai = async (loai,page_number) => {
  const res = await api.get(`/phim/loai?loai=${loai}&page_number=${page_number}&page_size=5`);
  return res.data;
};
export const getMovieCountry = async (country,page_number) => {
  const res = await api.get(`/phim/quocgia?quocgia=${country}&page_number=${page_number}&page_size=24`);
  return res.data;
};
export const getMovieNEW = async () => {
  const res = await api.get(`/phim/new`);
  return res.data;
};
export const filterMovie = async (quocgia, theloai_id, loai, nam) => {
  let url = "/phim/loc";

  url += `?quocgia=${encodeURIComponent(quocgia)}&theloai_id=${encodeURIComponent(theloai_id)}&loai=${encodeURIComponent(loai)}&nam=${encodeURIComponent(nam)}`;


  const res = await api.get(url);
  return res.data;
};
export const SearchMovie = async(movie, page_number) => {
  let url =`/phim/search?key=${movie}&page_size=20&page_number=${page_number}`
  const res = await api.get(url);
  return res.data;
}


// export const CreateMovie = async (data) => {
//   const res = await api.post(`/phim`, data);
//   return res.data;
// };
// export const UpdateMovie = async (id, data) => {
//   const res = await api.put(`/phim/${id}`, data);
//   return res.data;
// };

