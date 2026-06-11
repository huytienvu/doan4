const Thongke = require('../Model/thongke');

const thongke = new Thongke();

const Tongquan = async (req, res) => {
  try {
    const data = await thongke.Tongquan();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};
const Thongke_top_phim_Category_Country_Actor = async (req, res) => {
  try {
    const data = await thongke.Thongke_top_phim_Category_Country_Actor();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Top5_phim_nhieu_luot_xem = async (req, res) => {
  try {
    const data = await thongke.Top5_phim_nhieu_luot_xem();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const get_created_at = async (req, res) => {
  try {
    const data = await thongke.get_created_at();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_topRatting = async (req, res) => {
  try {
    const data = await thongke.get_topRatting();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_topFavorite = async (req, res) => {
  try {
    const data = await thongke.get_Top_Favorite();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Doanhthu = async (req, res) => {
  try {
    const data = await thongke.Doanhthu();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
Tongquan,
Thongke_top_phim_Category_Country_Actor,
Top5_phim_nhieu_luot_xem,
get_created_at,
get_topRatting,
get_topFavorite,
Doanhthu
};