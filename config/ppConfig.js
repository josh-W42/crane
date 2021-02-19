const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// database
const db = require('../models');

// Passport serialize information to login
passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

// Deserialize user in order to check if the user exists.
passport.deserializeUser(async(id, callback) => {
    try {
        const user = await db.user.findByPk(id);
        if (user) {
            callback(null, user);
        } else {
            throw Error('No user found!');
        }
    } catch (error) {   
        console.log(error);
        callback(null, null);
    }
});

// Now implement the local strategy, lookup passport docs and local strategy.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, callback) => {
    try {
        const user = await db.user.findOne({ where: { email } });
        // we have to check if there is a user and if there is a valid password.

        if (!user || !user.validPassword(password)) {
            callback(null, false);
        } else {
            callback(null, user);
        }
    } catch (error) {
        console.log(error);
        callback(null, null);
    }
}));

module.exports = passport;