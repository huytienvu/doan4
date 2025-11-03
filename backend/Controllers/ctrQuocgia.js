const Quocgia = require('../Model/quocgia');

const quocgia = new Quocgia();

const getAll = async (req, res) => {
  try {
    const data = await quocgia.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const data = await quocgia.getbyid(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await quocgia.create(data);
    res.status(201).json({message : "Thêm danh mục thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body, id };
    const result = await quocgia.update(data);
    res.json({ message: "Cập nhật quốc gia thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getbyid,
  create,
  update
};