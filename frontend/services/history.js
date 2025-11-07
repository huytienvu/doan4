import api from '../utils/request'
export const getHistoryUser = async (id) => {
  const res = await api.get(`/lichsu/${id}`);
  return res.data;
};
export const createHistory = async (obj) => {
  const res = await api.post(`/lichsu`,obj);
  return res.data;
};
export const deleteHistory =async (user,phim) =>{
  const res = await api.delete(`lichsu/delete?user_id=${user}&phim_id=${phim}`)
  return res.data;
}