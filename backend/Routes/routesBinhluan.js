const express = require('express');
const router = express.Router();
const { getByPhim, create } = require('../Controllers/ctrBinhluan');

// Lấy bình luận theo phim (ai cũng xem được)
router.get('/:phim_id', getByPhim);

// Thêm bình luận (chỉ user đăng nhập mới được)
router.post('/', create);

module.exports = router;
