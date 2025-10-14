const express = require('express');
const phimController = require('../Controllers/ctrPhim');
const { authenticate,role } = require('../middleware/auth');

const router = express.Router();


router.get('/',phimController.getAllPhim);
router.get('/category/:id', phimController.getAllPhimdanhmuc);
router.get('/new', phimController.getPhimNEW);
router.get('/loai/:bole', phimController.getPhimBoLe);
router.get('/quocgia/:quocgia', phimController.getPhimQuocgia);
router.get('/:id', phimController.getPhimbyid);
router.get('/tapphim/:phim_id', phimController.getTapPhim);
// router.post('/', phimController.create);
// router.put('/:id', phimController.update);

module.exports = router;