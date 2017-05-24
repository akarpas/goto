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

module.exports = router;
