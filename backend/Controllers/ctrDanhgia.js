const Danhgia = require('../Model/danhgia');
const danhgia = new Danhgia();

const getByPhim = async (req, res) => {
  try {
    const { phim_id } = req.params;
    const data = await danhgia.getByPhim(phim_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAVG = async (req, res) => {
  try {
    const { phim_id } = req.params;
    const data = await danhgia.getAvg(phim_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const check = async (req, res) => {
  try {
    const data = req.body
    const result = await danhgia.check(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await danhgia.create(data
    );
    res.status(201).json({ message: "Thêm đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getByPhim,
  getAVG,
  check,
  create
};
