const express = require('express');
const quocgiaController = require('../Controllers/ctrQuocgia');

const router = express.Router();

router.get('/', quocgiaController.getAllUser);
router.get('/:id', quocgiaController.getbyid);


module.exports = router;