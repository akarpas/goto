/*jshint esversion: 6*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  id: Number,
  city: String,
  country: String,
  exotic: Boolean,
  location: String,
  climate: String,
  type: [],
  coordinates: {
    lat: Number,
    lng: Number
  },
  airports: []
});

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
