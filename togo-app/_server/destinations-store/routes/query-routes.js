/*jshint esversion: 6*/

const express = require('express');
const User = require('../models/user');
const Destination = require('../models/destination');
const amadeus = require("../helpers/amadeus_api");
const queryRoutes = express.Router();
const https = require('https');
const request = require('request-promise');


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

  var destinationsMatched = [];
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

  var flightCost = 0;
  var totalBudget = 0;
  switch (query.budget) {
    case "2000":
      flightCost = (2000 * (25/100));
      totalBudget = 2000;
    break;
    case "4000":
      flightCost = (4000 * (25/100));
      totalBudget = 4000;
    break;
    case "6000":
      flightCost = (6000 * (25/100));
      totalBudget = 6000;
    break;
    case "8000":
      flightCost = (8000 * (25/100));
      totalBudget = 8000;
    break;
    case "15000":
      flightCost = (15000 * (25/100));
      totalBudget = 15000;
    break;
  }

  var durationHours = 0;
  var durationMilliSeconds = 0;
  switch (query.budget) {
    case "6":
      durationHours = 6;
      durationMilliSeconds = (6*60*60*1000);
    break;
    case "12":
      durationHours = (4000 * (25/100));
      durationMilliSeconds = (12*60*60*1000);
    break;
    case "24":
      durationHours = (6000 * (25/100));
      durationMilliSeconds = (24*60*60*1000);
    break;
  }
  const API_KEY = "amadeus key here"; // ***************
  var x = 1;

  tmpResults.forEach(function(item){
    const destination = item.airports[0];
    // console.log("Airport " + x + " " + destination);
    x++;
    const url = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey="+API_KEY+"&origin="+origin+"&destination="+destination+"&departure_date=" + outDate + "&return_date=" + inDate + "&adults=1&max_price=" + 300 + "&currency=EUR&number_of_results=3";
    console.log("this is the final url: "+ url);
    let results;

    request.get(url).then(function(result){
      console.log("this is the result bro: " + result);
       results = JSON.parse(result);

        if (results.results !== undefined) {
          var index = results.results[0].itineraries[0].outbound.flights.length;
          console.log("this is the index: " + index);
          destinationsMatched.push(results.results[0].itineraries[0].outbound.flights[index-1].destination.airport);
        }
    });
    });

    setTimeout(function(){
      var tmpResults2 = [];
      tmpResults.forEach(function(item){
        if (destinationsMatched.indexOf(item.airports[0]) !== -1) {
          tmpResults2.push(item);
        }
      });
      console.log("these are the matched destinations: " + destinationsMatched);
      tmpResults2.forEach(function(item){
      });
    },12000);

}


module.exports = queryRoutes;
