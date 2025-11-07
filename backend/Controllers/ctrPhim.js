const Phim = require('../Model/phim');

const phim = new Phim();

const getAllPhim = async (req, res) => {
  try {
    const data = await phim.getAllPhim();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPhimBoLe = async (req, res) => {
  try {
    const { loai, page_number, page_size } = req.query;
    const data = await phim.getPhimBoLe(loai,page_number,page_size);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPhimQuocgia = async (req, res) => {
  try {
    const { quocgia, page_number, page_size } = req.query;
    const data = await phim.getPhimquocgia(quocgia, page_number, page_size);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllPhimdanhmuc = async (req, res) => {
  try {
    const { id, page_number, page_size } = req.query;
    const data = await phim.getAllPhimdanhmuc(id, page_number, page_size);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPhimNEW = async (req, res) => {
  try {
    const data = await phim.getPhimNEW();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPhimbyid = async (req, res) => {
  try {
    const id = req.params.id
    const data = await phim.getPhimbyid(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTapPhim = async (req, res) => {
  try {
    const id = req.params.phim_id
    const data = await phim.getTapPhim(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPhimDienvien = async (req, res) => {
  try {
    const id = req.params.id
    const data = await phim.getPhimDienvien(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const LocPhim = async (req, res) => {
  try {
    const { quocgia, theloai_id, loai, nam } = req.query;
    const data = await phim.filter({ quocgia, theloai_id, loai, nam });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const SearchPhim = async (req, res) => {
  try {
    const { key, page_number, page_size } = req.query;
    const data = await phim.SearchPhim(key, page_number, page_size);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await phim.create(data);
    res.status(201).json({ message: "Thêm phim thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await phim.update(id, data);
    res.status(201).json({ message: "Sửa phim thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getAllPhim,
  getPhimBoLe,
  getPhimQuocgia,
  getAllPhimdanhmuc,
  getPhimNEW,
  getPhimbyid,
  getTapPhim,
  getPhimDienvien,
  LocPhim,
  SearchPhim,
  create,
  update
};