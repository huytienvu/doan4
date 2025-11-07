const express = require('express');
const quocgiaController = require('../../Controllers/ctrQuocgia');
const { authenticate,role,User,Admin } = require('../../middleware/auth');

const router = express.Router();

// Thể loại: cho phép cả 'user' và 'admin'
router.get('/',authenticate,Admin, quocgiaController.getAll);
router.get('/:id',authenticate,Admin,  quocgiaController.getbyid);
router.post('/', authenticate, Admin, quocgiaController.create);
router.put('/:id', authenticate, Admin, quocgiaController.update);
// router.delete('/:id', authenticate, Admin, theloaiController.deleteTheloai);

module.exports = router;