const express = require('express');
const router = express.Router();
const { getByPhim,check, create,getAVG } = require('../Controllers/ctrDanhgia');

// Lấy bình luận theo phim (ai cũng xem được)
router.get('/:phim_id', getByPhim);
router.get('/avg/:phim_id', getAVG);
router.post('/check',check);
// Thêm bình luận (chỉ user đăng nhập mới được)
router.post('/', create);

module.exports = router;
