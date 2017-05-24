const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  address: String,
  street: String,
  postCode: String,
  city: String,
  country: String,
  places: [
    {
      city: String,
      lat: String,
      lng: String
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
