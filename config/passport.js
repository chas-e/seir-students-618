//require passport, then require the Oauth strategy that we want to instantiate - we can find this in the passport docs
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Student = require("../models/student");

//configure passport GoogleStrategy

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    },
    function(accessToken, refreshToken, profile, cb) {
        // user has logged in with OAuth2
        Student.findOne({ "googleId": profile.id }, function(err, student) {
            if (err) return cb(err);
            if (student) {
                return cb(null, student);
            } else {
                // this means new student, create instance and save - like before
                const newStudent = new Student({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
                newStudent.save(function(err) {
                    if (err) return cb(err);
                    return cb(null, newStudent);
                });
            }
        });
    }
));

// passport serialize user

passport.serializeUser(function(student, done) {
    done(null, student.id);
});

// passport deserialize user for when we want to pass back info

passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, student) {
        done(err, student);
    });
});