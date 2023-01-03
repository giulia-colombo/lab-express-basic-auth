const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;

router.get('/main', isLoggedIn, (req, res, next) => {
 res.render('main');
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private')
});

