const express = require("express");
const AuthController = require("../Controllers/ctrUser" );

const router = express.Router();

// POST /api/login
router.post("/login", AuthController.login);
router.get('/check/:id',AuthController.checkVip);

module.exports = router;
