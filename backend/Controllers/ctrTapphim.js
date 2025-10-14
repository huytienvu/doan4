const Tapphim = require('../Model/tapphim');

const tapphim = new Tapphim();


const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await tapphim.create(data);
    res.status(201).json({message : "Thêm tập phim thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteTapphim = async (req, res) => {
  try {
    const id = req.params.id
    const result = await tapphim.delete(id);
    res.status(201).json({message : "Xóa tập phim thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  deleteTapphim,
  create
};