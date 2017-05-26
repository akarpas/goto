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

router.put('/users', (req, res, next) => {
  console.log(req);
  // if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   res.status(400).json({ message: 'Specified id is not valid' });
  //   return;
  // }
  //
  // const updates = {
  //   brand: req.body.brand,
  //   name: req.body.name,
  //   specs: req.body.specs,
  //   image: req.body.image
  // };
  //
  // User.findByIdAndUpdate(req.params.id, updates, (err) => {
  //   if (err) {
  //     res.json(err);
  //     return;
  //   }
  //
  //   res.json({
  //     message: 'Places updated successfully'
  //   });
  // });
});

module.exports = router;
