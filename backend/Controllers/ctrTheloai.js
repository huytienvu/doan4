const Theloai = require('../Model/theloai');

const theloai = new Theloai();

const getAll = async (req, res) => {
  try {
    const data = await theloai.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllUser = async (req, res) => {
  try {
    const data = await theloai.getAllUser();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const data = await theloai.getbyid(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await theloai.create(data);
    res.status(201).json({message : "Thêm danh mục thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body, id };
    const result = await theloai.update(data);
    res.json({ message: "Cập nhật thể loại thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTheloai = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await theloai.delete(id);
    res.json({ message: "Xóa thể loại thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getAllUser,
  getbyid,
  create,
  update,
  deleteTheloai
};