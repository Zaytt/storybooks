const express   = require('express');
const mongoose  = require('mongoose');
const passport  = require('passport');

// --------------- PASSPORT CONFIG ---------------
require('./config/passport')(passport);

const app = express();

// --------------- LOAD ROUTES ---------------
const auth = require('./routes/auth');
// --------------- HOME ROUTES ---------------
app.get('/', (req, res) => {
  res.send("Works!");
});
// --------------- USE ROUTES ---------------
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});