const express = require('express');
const theloaiController = require('../Controllers/ctrTheloai');
const { authenticate,role } = require('../middleware/auth');

const router = express.Router();

// Thể loại: cho phép cả 'user' và 'admin'
router.get('/', theloaiController.getAll);
router.get('/:id',  theloaiController.getbyid);
router.post('/', authenticate, role(['User', 'Admin']), theloaiController.create);
router.put('/:id', authenticate, role(['User', 'Admin']), theloaiController.update);
router.delete('/:id', authenticate, role(['User', 'Admin']), theloaiController.deleteTheloai);

module.exports = router;