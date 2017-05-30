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
  let finalResults;

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
    finalResults = checkFlightsMaxPrice(query, tmpResults);

  });

  res.json(finalResults);

});

function checkFlightsMaxPrice(query, tmpResults) {

  var tmpResults2 = []; // This will include the filtered out result from
  // tmpResults, where the destinations are filtered by MAXPRICE
  var tmpResults3 = []; // This will include the filtered out result from
  // tmpResults2, where the destinations are filtered by Duration
  var destinationsMatched = []; // This will hold all the destinations returned
  // by Amadeus for the Max Price criteria.
  var searchResults = []; // array to hold all the search results received from
  // first API request to avoid repetition of requests
  console.log("This is the query: " + query);
  const country = query.country_loc;
  const currency = "EUR";
  const origin = query.origin_airport;
  const outDate = query.startDate;
  const inDate = query.endDate;
  const adults = 1;
  const numberOfResults = 3;

  // Switch to turn value selected through frontend (the main form) to
  // actual number and save in totalBudget and flightCost
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

  // Switch to turn value selected through frontend (the main form) to
  // actual number and save as hours and as milliseconds
  var durationHours = 0;
  var durationMilliSeconds = 0;
  switch (query.duration) {
    case "6":
      durationHours = 6;
      durationMilliSeconds = (6*60*60*1000);
    break;
    case "12":
      durationHours = 12;
      durationMilliSeconds = (12*60*60*1000);
    break;
    case "24":
      durationHours = 24;
      durationMilliSeconds = (24*60*60*1000);
    break;
  }
  const API_KEY = "key"; // *APIKEY*

  tmpResults.forEach(function(item){
    const destination = item.airports[0];
    // console.log("Airport " + x + " " + destination);
    const url = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey="+API_KEY+"&origin="+origin+"&destination="+destination+"&departure_date=" + outDate + "&return_date=" + inDate + "&adults=1&max_price=" + 300 + "&currency=" + currency + "&number_of_results=" + numberOfResults;
    console.log("this is the final url: "+ url);

    request.get(url).then(function(result){
      console.log("this is the result bro: " + result);
       results = JSON.parse(result);
       searchResults.push(results);

        if (results.results !== undefined) {
          var index = results.results[0].itineraries[0].outbound.flights.length;
          console.log("this is the index: " + index);
          destinationsMatched.push(results.results[0].itineraries[0].outbound.flights[index-1].destination.airport);
        }
    });
    });

    setTimeout(function(){
      tmpResults.forEach(function(item){
        if (destinationsMatched.indexOf(item.airports[0]) !== -1) {
          tmpResults2.push(item);
        }
      });
      console.log("these are the matched destinations: " + destinationsMatched);
      tmpResults2.forEach(function(item){
      });
    },11000);

    setTimeout(function(){
      tmpResults3 = checkFlightsDuration(query, tmpResults2, searchResults, durationHours, durationMilliSeconds);
      return tmpResults3;
    },11500);

}

function checkFlightsDuration(query, tmpResults2, searchResults, durationHours, durationMilliSeconds) {

  var tmpResults3 = [];
  var destinationsMatched = []; // This will hold all the filtered destinations
  // for the Duration criteria.
  console.log("this is the duration Hours passed from function: " + durationHours);
  searchResults.forEach(function(item){
    for (var i = 0; i<3; i++) {
      var lastIndex = (item.results[i].itineraries[0].outbound.flights.length - 1);
      var destination = item.results[i].itineraries[0].outbound.flights[lastIndex].destination.airport;
      var departs = item.results[i].itineraries[0].outbound.flights[0].departs_at;
      var arrives = item.results[i].itineraries[0].outbound.flights[lastIndex].arrives_at;
      var departsFinal = new Date(departs).getTime();
      var arrivesFinal = new Date(arrives).getTime();

      console.log("departsFinal: " + departsFinal);
      console.log("arrivesFinal: " + arrivesFinal);
      var calcDuration = arrivesFinal - departsFinal;

      var calcDurationHours = Math.floor(calcDuration/1000/60/60);
      console.log("this is the duration in hours: " + calcDurationHours );

      if ( calcDurationHours <= durationHours) {
        destinationsMatched.push(destination);
        console.log("destination pushed: " + destination);
        console.log("array after push: " + destinationsMatched);
        i=3;
      }
    }



  });
  tmpResults2.forEach(function(item){
    if (destinationsMatched.indexOf(item.airports[0]) !== -1) {
      tmpResults3.push(item);
    }
  });
  console.log("these are the FINAL matched destinations: " + destinationsMatched);
  tmpResults3.forEach(function(item){
    console.log(item.city);
  });


  return tmpResults3;

}

module.exports = queryRoutes;
