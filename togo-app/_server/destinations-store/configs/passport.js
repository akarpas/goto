/*jshint esversion: 6*/
const passport      = require("passport");
var jwtOptions      = require('./jwtOptions');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user');
const bcrypt        = require('bcrypt');
var passportJWT     = require("passport-jwt");
var JwtStrategy     = passportJWT.Strategy;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  User.findById(jwt_payload.id,(err, user)=>{
    console.log('passportStrategy user: ', user);
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null,user);
    } else {
      done(null,false);
    }
  });
});

passport.use(strategy);

// const passportConfig = function (passport) {
//
//   passport.serializeUser((loggedInUser, cb) => {
//     cb(null, loggedInUser._id);
//   });
//
//   passport.deserializeUser((userIdFromSession, cb) => {
//     User.findById(userIdFromSession, (err, userDocument) => {
//       if (err) {
//         cb(err);
//         return;
//       }
//
//       cb(null, userDocument);
//     });
//   });
//
//   passport.use(new LocalStrategy({
//       passReqToCallback: true,
//       usernameField: 'email',
//       passwordField: 'password'
//   }, (req, email, password, next) => {
//     User.findOne({ email }, (err, foundUser) => {
//       if (err) {
//         next(err);
//         return;
//       }
//
//       if (!foundUser) {
//         next(null, false, { message: 'Incorrect username' });
//         return;
//       }
//
//       if (!bcrypt.compareSync(password, foundUser.password)) {
//         next(null, false, { message: 'Incorrect password' });
//         return;
//       }
//
//       next(null, foundUser);
//     });
//   }));
// };
//
// module.exports = passportConfig;
