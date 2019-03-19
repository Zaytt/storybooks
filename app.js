const express   = require('express');
const exphbs    = require('express-handlebars');
const mongoose  = require('mongoose');
const passport  = require('passport');
const session   = require('express-session');
const cookieParser = require('cookie-parser');


/* --------------- LOAD KEYS --------------- */
const keys  = require('./config/keys');

/* --------------- LOAD MODELS --------------- */
require('./models/User');

/* --------------- PASSPORT CONFIG --------------- */
require('./config/passport')(passport);

/* --------------- MONGOOSE CONFIG --------------- */

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect(keys.mongoURI, { 
  useNewUrlParser: true 
})
  .then( () => console.log('MongoDB connected'))
  .catch( err => console.log(err))

const app = express();


/* --------------- MIDDLEWARES --------------- */
// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: 'false',
  saveUninitialized: false
}))

// PASSPORT MIDDLEWARE 
app.use(passport.initialize());
app.use(passport.session());

// SET GLOBAL VARS
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})


/* --------------- LOAD ROUTES --------------- */
const auth = require('./routes/auth');
const index = require('./routes/index');
/* --------------- USE ROUTES --------------- */
app.use('/auth', auth);
app.use('/', index);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});