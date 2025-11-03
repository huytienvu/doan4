const Dienvien = require('../Model/dienvien');

const dienvien = new Dienvien();

const getAll = async (req, res) => {
  try {
    const data = await dienvien.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const data = await dienvien.getbyid(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetPhimdienvien = async (req, res) => {
  try {
    const id = req.params.id
    const data = await dienvien.GetPhimdienvien(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await dienvien.create(data);
    res.status(201).json({message : "Thêm diễn viên thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body, id };
    const result = await dienvien.update(data);
    res.json({ message: "Cập nhật diễn viên thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletedienvien = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await dienvien.delete(id);
    res.json({ message: "Xóa diễn viên thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Searchdienvien = async (req, res) => {
  try {
    const {key,page_number,page_size } = req.query;
    const result = await dienvien.Search(key,page_number,page_size);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getbyid,
  GetPhimdienvien,
  create,
  update,
  deletedienvien,
  Searchdienvien
};