import api from '../../utils/request'

export const getTongquan = async () => {
  const res = await api.get(`/admin/thongke/tongquan`);
  return res.data;
};
export const getThongke_top_phim_Category_Country_Actor = async () => {
  const res = await api.get(`/admin/thongke/countphim`);
  return res.data;
};
export const getTop5_phim_nhieu_luot_xem = async () => {
  const res = await api.get(`/admin/thongke/top5phimnhieuluotxem`);
  return res.data;
};
export const get_created_at = async () => {
  const res = await api.get(`/admin/thongke/get_created_at`);
  return res.data;
};
