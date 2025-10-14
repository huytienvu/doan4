const express = require('express');
const yeuthichController = require('../Controllers/ctrYeuthich');

const router = express.Router();

router.get('/:id', yeuthichController.getbyUser);
router.post('/', yeuthichController.create);
router.post('/check', yeuthichController.check);
router.delete('/', yeuthichController.deleted);

module.exports = router;