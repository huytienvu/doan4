const express = require('express');
const phimController = require('../../Controllers/ctrPhim');
const { authenticate,role } = require('../../middleware/auth');

const router = express.Router();

// Phim: chỉ cho phép 'admin'
router.get('/', authenticate,role(["Admin"]), phimController.getAllPhim);
router.put('/state', authenticate,role(["Admin"]), phimController.statePhim);
router.get('/:id' ,authenticate,role(["Admin"]), phimController.getPhimbyid);
router.post('/', authenticate,role(["Admin"]), phimController.create);
router.put('/:id', authenticate,role(["Admin"]), phimController.update);


module.exports = router;