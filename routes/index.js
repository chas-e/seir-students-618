const router = require('express').Router();
// require passport module here
const passport = require("passport");


router.get('/', function(req, res) {
    res.redirect('/students');
});

// login route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// google callback route
router.get('/oauth2callback', passport.authenticate('google', {
    successRedirect: '/students',
    failureRedirect: '/'
}));

// logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;