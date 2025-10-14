const Yeuthich = require('../Model/yeuthich');

const yeuthich = new Yeuthich();

const getbyUser = async (req, res) => {
  try {
    const id = req.params.id
    const data = await yeuthich.getbyUser(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const check = async (req, res) => {
  try {
    const data = req.body
    const result = await yeuthich.check(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await yeuthich.create(data);
    res.status(201).json({message : "Thêm yêu thích thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleted = async (req, res) => {
  try {
    
    const { user_id, phim_id } = req.query;
    const result = await yeuthich.deleted(user_id,phim_id);
    res.status(201).json({message : "Xóa yêu thích thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
getbyUser,
create,
check,
deleted
};