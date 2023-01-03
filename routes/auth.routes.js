const bcrypt = require('bcryptjs')
const express = require('express');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model')

//sign up
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})  

router.post('/signup', isLoggedOut, (req, res) => {
    console.log(req.body);

    const {username, email, password} = req.body;

    bcrypt.hash(password, saltRounds)
        .then(hash => {
            return User.create({username, email, passwordHash: hash})
        })
        .then(newUser => {
            req.session.currentUser = newUser;
            res.redirect(`/auth/profile`)
        })
        .catch(err => console.log(err))
})

//login GET route
router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

//login POST route
router.post('/login', isLoggedOut, (req, res, next) => {
    console.log('SESSION ===>', req.session);
    const { email, password } = req.body;
    //const email = req.body.email;
    //const password = req.body.password;

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: "Please enter both email and password to login."
        });
        return;
    }

    User.findOne({email})
    .then(user => {
        if (!user) {
            res.render('auth/login', { errorMessage: "Email is not registered. Try with another email."});
            return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect('/auth/profile');
        } else {
            res.render('auth/login', {errorMessage: "Incorrect password"})
        }
    })
    .catch(err => console.log(err))
})

// //profile route
// router.get('/profile/:username', (req, res) => {
//     const {username} = req.params;

//     User.findOne({username})
//         .then(foundUser => res.render('auth/profile', foundUser)) // what does this do?
//         .catch(err => console.log(err))
// })

//profile route - with express-session
router.get('/profile', isLoggedIn, (req, res) => {
    const { currentUser } = req.session;
    currentUser.loggedIn = true;
    res.render('auth/profile', currentUser);
 })

module.exports = router;

//logout route
router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err); //??????
        res.redirect("/");
    });
});

