const express = require('express');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const { storeReturnTo } = require('../utils/middleware');

const users = require("../controllers/auth");


router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))

// router.get("/register", users.renderRegister)
// router.post("/register", catchAsync(users.registerUser));

router.route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

// router.get("/login", users.renderLogin)
// router.post("/login", storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get("/logout", users.logout)



module.exports = router;