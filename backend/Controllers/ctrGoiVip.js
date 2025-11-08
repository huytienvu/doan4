const GoiVip = require('../Model/goivip');

const goivip = new GoiVip();

const getAll = async (req, res) => {
  try {
    const data = await goivip.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await goivip.create(data);
    res.status(201).json({message : "Thêm gói vip thành công"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// const deleted = async (req, res) => {
//   try {
    
//     const { user_id, phim_id } = req.query;
//     const result = await yeuthich.deleted(user_id,phim_id);
//     res.status(201).json({message : "Xóa yêu thích thành công"});
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
module.exports = {
getAll,create
};