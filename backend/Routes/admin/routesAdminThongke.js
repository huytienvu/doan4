const express = require('express');
const thongkeController = require('../../Controllers/ctrThongke');
const { authenticate,role,User,Admin } = require('../../middleware/auth');

const router = express.Router();

// Thể loại: cho phép cả 'user' và 'admin'
router.get('/tongquan',authenticate,Admin, thongkeController.Tongquan);
router.get('/countphim',authenticate,Admin, thongkeController.Thongke_top_phim_Category_Country_Actor);
router.get('/top5phimnhieuluotxem',authenticate,Admin, thongkeController.Top5_phim_nhieu_luot_xem);
router.get('/get_created_at',authenticate,Admin, thongkeController.get_created_at);
module.exports = router;