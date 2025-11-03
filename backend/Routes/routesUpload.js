const express = require('express');
const router = express.Router();
const controller = require('../Controllers/ctrUpload');

router.post('/image', controller.uploadImage);

router.post('/video', controller.uploadVideo);

router.post('/dienvien', controller.uploadImageActor);


module.exports = router;
