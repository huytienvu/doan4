const express = require('express');
const tapphimController = require('../Controllers/ctrTapphim');

const router = express.Router();


router.post('/', tapphimController.create);
router.delete('/:id', tapphimController.deleteTapphim);

module.exports = router;