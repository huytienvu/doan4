const express = require('express');
const thanhtoanController = require('../Controllers/ctrThanhtoan');

const router = express.Router();

router.get('/get/:id', thanhtoanController.gethoadon);
router.put('/',thanhtoanController.updateHoadon)
router.post('/',thanhtoanController.createHoadon);

module.exports = router;