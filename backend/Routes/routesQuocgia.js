const express = require('express');
const quocgiaController = require('../Controllers/ctrQuocgia');

const router = express.Router();

router.get('/', quocgiaController.getAll);
router.get('/:id', quocgiaController.getbyid);
router.post('/', quocgiaController.create);
router.put('/:id', quocgiaController.update);

module.exports = router;