const express   = require('express');
const exphbs    = require('express-handlebars');
const path      = require('path');
const mongoose  = require('mongoose');
const passport  = require('passport');
const session   = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');



const app = express();

/* --------------- LOAD KEYS --------------- */
const keys  = require('./config/keys');

/* --------------- LOAD HANDLEBARS HELPERS --------------- */
const {truncate, stripHTMLTags, formatDate, select, editIcon, compare} = require('./helpers/hbs');

/* --------------- LOAD MODELS --------------- */
require('./models/User');
require('./models/Story');

/* --------------- PASSPORT CONFIG --------------- */
require('./config/passport')(passport);

/* --------------- SET STATIC FOLDER --------------- */
app.use(express.static(path.join(__dirname, 'public')));

/* --------------- MONGOOSE CONFIG --------------- */

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect(keys.mongoURI, { 
  useNewUrlParser: true 
})
  .then( () => console.log('MongoDB connected'))
  .catch( err => console.log(err))

/* --------------- MIDDLEWARES --------------- */
// Method Override Middleware
app.use(methodOverride('_method'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json


// Handlebars
app.engine('handlebars', exphbs({
  helpers: {truncate, stripHTMLTags, formatDate, select, editIcon, compare},
  defaultLayout: 'main'
}));



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
const stories = require('./routes/stories');
/* --------------- USE ROUTES --------------- */
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});