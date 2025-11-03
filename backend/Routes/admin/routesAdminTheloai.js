const express = require('express');
const theloaiController = require('../../Controllers/ctrTheloai');
const { authenticate,role,User,Admin } = require('../../middleware/auth');

const router = express.Router();

// Thể loại: cho phép cả 'user' và 'admin'
router.get('/',authenticate,Admin, theloaiController.getAll);
router.get('/:id',authenticate,Admin,  theloaiController.getbyid);
router.post('/', authenticate, Admin, theloaiController.create);
router.put('/:id', authenticate, Admin, theloaiController.update);
router.delete('/:id', authenticate, Admin, theloaiController.deleteTheloai);

module.exports = router;