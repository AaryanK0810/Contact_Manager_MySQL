const userController = require('../controllers/userController');
const express = require ('express');
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register" , userController.register);

router.post('/login' , userController.login)

module.exports = router;