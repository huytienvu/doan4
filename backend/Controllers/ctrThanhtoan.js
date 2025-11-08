const Thanhtoan = require('../Model/thanhtoan');

const thanhtoan = new Thanhtoan();

const gethoadon = async (req, res) => {
  try {
    const id = req.params.id
    const data = await thanhtoan.gethoadon(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createHoadon = async (req, res) => {
  try {
    const obj = req.body
    const data = await thanhtoan.createHoadon(obj);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateHoadon = async (req, res) => {
  try {
    const {id,state } = req.body
    const data = await thanhtoan.updateHoadon(id,state);
    res.json({mess : "update trạng thái thành công"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
gethoadon,
createHoadon,
updateHoadon
};