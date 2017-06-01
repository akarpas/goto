/*jshint esversion: 6*/

var express = require('express');
var router = express.Router();

const Destination = require('../models/destination.js');
const User = require('../models/user.js');

router.get('/destinations', function(req, res, next) {
  Destination.find((err,destinationsList)=>{
    if(err) {
      res.json(err);
      return;
    }
    res.json(destinationsList);
  });
});

router.get('/users/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, (err,user)=>{
      if (err) {
        res.status(500).json({message: err});
      } else {
				console.log(user);
				res.status(200).json(user);
			}
  });
});

router.post('/users', (req, res, next)=> {
  const theUser = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    street: req.body.street,
    streetN: req.body.streetN,
    postCode: req.body.postCode,
    city: req.body.city,
    country: req.body.country
  });

  theUser.save((err)=>{
    if (err) {
      res.json(err);
      return;
    }
  });

  res.json({
    message: 'Success',
    id: theUser._id
  });
});

router.put('/users/:user_id', (req, res, next) => {
  console.log("THIS IS REQ: ",req);
  console.log("THIS WORKS!");

  User.findById(req.params.user_id, (err,user)=>{
      if (err) {
        res.status(500).json({message: err});
      } else {
        var index = user.places.length;
        var tmpPlace = {
          city: req.body.city,
          country: req.body.country,
          lat: req.body.lat,
          lng: req.body.lng
        };
        user.places.push(tmpPlace);
        const newUser = user;
        User.findByIdAndUpdate(req.params.user_id, newUser, (err) => {
          if (err) {
            res.json(err);
            return;
          }

          res.json({
            message: 'User updated successfully'
          });
        });
			}
    });
});

router.put('/users/wishlist/:user_id', (req, res, next) => {
  console.log("THIS IS REQ: ",req);
  console.log("THIS WORKS!");

  User.findById(req.params.user_id, (err,user)=>{
      if (err) {
        res.status(500).json({message: err});
      } else {
        var index = user.places.length;
        var wishPlace = {
          city: req.body.city,
          country: req.body.country,
          lat: Number(req.body.coordinates.lat),
          lng: Number(req.body.coordinates.lng)
        };
        console.log("Wish place before adding to wishlist: " + JSON.stringify(wishPlace));
        user.wishlist.push(wishPlace);
        const newUser = user;
        User.findByIdAndUpdate(req.params.user_id, newUser, (err) => {
          if (err) {
            res.json(err);
            return;
          }

          res.json({
            message: 'User updated successfully'
          });
        });
			}
    });
});

router.put('/users/removeplace/:user_id', (req, res) => {

  User.findById(req.params.user_id, (err,user)=>{
      if (err) {
        res.status(500).json({message: err});
      } else {
        var index;
        index = user.places.indexOf(req.body.place);
        user.places.splice(index, 1);
        const newUser = user;
        User.findByIdAndUpdate(req.params.user_id, newUser, (err) => {
          if (err) {
            res.json(err);
            return;
          }

          res.json({
            message: 'User updated successfully'
          });
        });
			}
    });
});

router.put('/users/removewishlist/:user_id', (req, res) => {

  User.findById(req.params.user_id, (err,user)=>{
      if (err) {
        res.status(500).json({message: err});
      } else {
        var index;
        index = user.wishlist.indexOf(req.body.place);
        user.wishlist.splice(index, 1);
        const newUser = user;
        User.findByIdAndUpdate(req.params.user_id, newUser, (err) => {
          if (err) {
            res.json(err);
            return;
          }

          res.json({
            message: 'User updated successfully'
          });
        });
			}
    });
});

module.exports = router;
