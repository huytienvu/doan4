const express = require('express');
const dienvienController = require('../Controllers/ctrDienvien');

const router = express.Router();

router.get('/', dienvienController.getAll);
router.get('/:id', dienvienController.getbyid);
router.post('/', dienvienController.create);
router.put('/:id', dienvienController.update);
router.delete('/:id', dienvienController.deletedienvien);

module.exports = router;