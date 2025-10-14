const Binhluan = require('../Model/binhluan');
const binhluan = new Binhluan();

const getByPhim = async (req, res) => {
  try {
    const { phim_id } = req.params;
    const data = await binhluan.getByPhim(phim_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { user_id, phim_id, binh_luan } = req.body;
    if (!user_id || !phim_id || !binh_luan) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const data = await binhluan.create({ user_id, phim_id, binh_luan });
    res.status(201).json({message : "Thêm bình luận thành công"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getByPhim,
  create
};
