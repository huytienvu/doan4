const express = require('express');
const quocgiaController = require('../Controllers/ctrQuocgia');

const router = express.Router();

router.get('/', quocgiaController.getAll);
router.get('/:id', quocgiaController.getbyid);
router.post('/', quocgiaController.create);

module.exports = router;