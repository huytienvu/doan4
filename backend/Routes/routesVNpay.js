const express= require('express');
const router =express.Router()
const {create,check} = require('../Controllers/ctrVnpay')

router.post('/create',create);
router.get('/check',check)

module.exports=router;