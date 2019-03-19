const mongoose = require('mongoose');

//Create Schema
const UserSchema = new mongoose.Schema({
  googleID:   { type: String, required: true },
  email:      { type: String, required: true},
  firstName:  { type: String },
  lastName:   { type: String },
  image:      { type: String }
});

// Create collection & Schema
mongoose.model('users', UserSchema);