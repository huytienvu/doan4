const express = require('express');
const lichsuController = require('../Controllers/ctrLichsu');

const router = express.Router();

router.get('/:id', lichsuController.getbyUser);
router.post('/',lichsuController.create);
router.delete('/delete',lichsuController.deleted)


module.exports = router;