const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {db}=require("../config/db");

const {login,register} =require("../controllers/usercontroller");


router.post("/register", register);

router.post("/login", login);
module.exports = router;
