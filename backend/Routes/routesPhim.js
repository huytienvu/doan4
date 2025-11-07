const express = require('express');
const phimController = require('../Controllers/ctrPhim');
const { authenticate,role } = require('../middleware/auth');

const router = express.Router();


router.get('/',phimController.getAllPhim);
router.get('/category', phimController.getAllPhimdanhmuc);
router.get('/new', phimController.getPhimNEW);
router.get('/dienvien/:id', phimController.getPhimDienvien);
router.get('/loc', phimController.LocPhim);
router.get('/search', phimController.SearchPhim);
router.get('/loai', phimController.getPhimBoLe);
router.get('/quocgia', phimController.getPhimQuocgia);
router.get('/:id', phimController.getPhimbyid);
router.get('/tapphim/:phim_id', phimController.getTapPhim);

// router.post('/', phimController.create);
// router.put('/:id', phimController.update);

module.exports = router;