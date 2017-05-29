/*jshint esversion: 6*/

const express = require('express');
const User = require('../models/user');
const Destination = require('../models/destination');
const amadeus = require("../helpers/amadeus_api");
const queryRoutes = express.Router();
const https = require('https');
const request = require('request');


// Code here //
queryRoutes.post('/search',(req, res, next)=>{
  console.log("req: " + JSON.stringify(req.body));
  let query = req.body;

  let resultsIndex = 0;
  let tmpResults = [];

  Destination.find((err,destinationsList)=>{
    if(err) {
      res.json(err);
      return;
    }
    // Loop through destinations and check first type for match
    destinationsList.forEach(function(destination) {
      if (destination.type[0] === req.body.type) {
        tmpResults.push(destination);
        resultsIndex++;
      }
    });
    // If results are less/equal than 15, redo search
    // but for type position 1
    if (resultsIndex <= 20) {
      destinationsList.forEach(function(destination) {
        if (destination.type[1] === req.body.type) {
          tmpResults.push(destination);
          resultsIndex++;
        }
      });
    }
    // If results are less/equal than 15, redo search
    // but for type position 2
    if (resultsIndex <= 20) {
      destinationsList.forEach(function(destination) {
        if (destination.type[2] === req.body.type) {
          tmpResults.push(destination);
          resultsIndex++;
        }
      });
    }
    if (resultsIndex <= 20) {
      destinationsList.forEach(function(destination) {
        if (destination.type[3] === req.body.type) {
          tmpResults.push(destination);
          resultsIndex++;
        }
      });
    }
    console.log("this is the resultsIndex: " + resultsIndex);
    console.log(tmpResults.length);
    if (tmpResults.length > 20) {
      tmpResults.splice(20, tmpResults.length-1);
    }
    let i = 1;
    tmpResults.forEach(function(result) {
      console.log("this is choice " + i + ": " + result.city);
      i++;
    });
    checkFlights(query, tmpResults);

  });


});

function checkFlights(query, tmpResults) {

  console.log("in check flights function");
  console.log("temp results: " + tmpResults);
  console.log("query: " + query);
  const header = "Content-Type: application/x-www-form-urlencoded";
  const country = query.country_loc;
  const currency = "EUR";
  const locale = "en_ES";
  const origin = query.origin_airport;
  // const destination =
  const outDate = query.startDate;
  const inDate = query.endDate;
  const adults = 1;
  const API_KEY = "SKYSCANNERKEY";
  var x = 1;

  tmpResults.forEach(function(result){
    const destination = result.airports[0];
    console.log("Airport " + x + " " + destination);
    x++;
  });
  // curl "http://partners.api.skyscanner.net/apiservices/pricing/v1.0"
  //   -X POST
  //   -H "Content-Type: application/x-www-form-urlencoded"
  //   -d 'country=UK
  //   &currency=GBP
  //   &locale=en-GB
  //   &locationSchema=iata
  //   &originplace=EDI
  //   &destinationplace=LHR
  //   &outbounddate=2017-05-30
  //   &inbounddate=2017-06-02
  //   &adults=1
  //   &children=0
  //   &infants=0
  //   &apikey=prtl6749387986743898559646983194'

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const url = "http://partners.api.skyscanner.net/apiservices/pricing/v1.0"+city+"|country:"+country +"&key=AIzaSyCIItiTxhbvrYb-azJAsLehb8YJFoKYH84";
    request(url, (err, resp, body)=> {
       body = JSON.parse(body);
       console.log("this is the body: " + JSON.stringify(body.results[0].geometry.location.lat));
       if (err) {
         res.status(401).json({message: "error"});
        } else {
          coordinates.lat = body.results[0].geometry.location.lat;
          coordinates.lng = body.results[0].geometry.location.lng;
        }
        console.log("before exit: City: " + city + " - " + JSON.stringify(coordinates));
        callback(tmpCoordinates, coordinates);

        });

}

module.exports = queryRoutes;
