/*jshint esversion: 6*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  street: String,
  streetN: String,
  postCode: String,
  city: String,
  country: String,
  country_loc: String,
  lat: Number,
  lng: Number,
  places: [
    {
      city: String,
      country: String,
      lat: Number,
      lng: Number
    }
  ],
  wishlist: [
    {
      city: String,
      country: String,
      lat: Number,
      lng: Number
    }
  ]
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
