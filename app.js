const express   = require('express');
const mongoose  = require('mongoose');

const app = express();

// ROUTES

app.get('/', (req, res) => {
  res.send("Works!");
});

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});