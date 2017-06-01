/*jshint esversion: 6*/

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const authRoutes = express.Router();
var jwt = require('jsonwebtoken');
var jwtOptions = require('../configs/jwtOptions');


authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  const street= req.body.street;
  const streetN = req.body.streetN;
  const postCode = req.body.postCode;
  const city = req.body.city;
  const country = req.body.country;
  const country_loc = req.body.country_loc;
  const lat = Number(req.body.lat);
  const lng = Number(req.body.lng);
  const places = req.body.places;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  User.findOne({ username }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'The username already exists' });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      email: username,
      password: hashPass,
      name: name,
      surname: surname,
      stree: street,
      streetN: streetN,
      postCode: postCode,
      city: city,
      country: country,
      country_loc: country_loc,
      lat: lat,
      lng: lng,
      // places: places
    });

    theUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: 'Something went wrong' });
        return;
      } else {
        var payload = {id: user._id, user: user.username};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({message: "ok", token: token, user: user});
      }
    });
  });
});

authRoutes.post('/login', (req, res) => {

  if(req.body.email && req.body.password){
    var email = req.body.email;
    var password = req.body.password;
  }

  if (email === "" || password === "") {
    res.status(401).json({message:"fill up the fields"});
    return;
  }

  User.findOne({ "email": email }, (err, user)=> {
  	if( ! user ){
	    res.status(401).json({message:"no such user found"});
	  } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          res.status(401).json({message:"passwords did not match"});
        } else {
        	console.log('user', user);
          var payload = {id: user._id, user: user.email};
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          console.log(token);
          res.json({message: "ok", token: token, user: user});
        }
      });
    }
  });
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  // console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

authRoutes.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});



module.exports = authRoutes;
