var express = require('express');
var router = express.Router();

const Destination = require('../models/destination.js');

router.get('/destinations', function(req, res, next) {
  Destination.find((err,destinationsList)=>{
    if(err) {
      res.json(err);
      return;
    }
    res.json(destinationsList);
  });
});

router.post('/users', (req, res, next)=> {
  const theUser = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    street: req.body.street,
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

module.exports = router;
