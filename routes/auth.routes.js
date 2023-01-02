const bcrypt = require('bcryptjs')
const express = require('express');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model')

//sign up
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})  

router.post('/signup', (req, res) => {
    console.log(req.body);

    const {username, email, password} = req.body;

    bcrypt.hash(password, saltRounds)
        .then(hash => {
            return User.create({username, email, passwordHash: hash})
        })
        .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))
        .catch(err => console.log(err))
})

//login route

//profile route
router.get('/profile/:username', (req, res) => {
    const {username} = req.params;

    User.findOne({username})
        .then(foundUser => res.render('auth/profile', foundUser)) // what does this do?
        .catch(err => console.log(err))
})

module.exports = router;