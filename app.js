var dotEnv          = require('dotenv').config(),
    express         = require('express'),
    morgan          = require('morgan'),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    app             = express(),
    indexRouter     = require('./server/routes/index.js'),

app.set('view engine', 'ejs');

// connect to db
// process.env.MONGOLAB_URI is needed for when we deploy to Heroku
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/user_auth" );

app.use(cookieParser());

// log requests to STDOUT
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

var indexRouter = require('./server/routes/index.js');
app.use('/', indexRouter);


// Set static file root folder
app.use(express.static('client/public'));

app.use('/', indexRouter);

var port = process.env.PORT || 8080;

app.listen( port, function(){
  console.log( '... awaiting connections on port: 8080' );
});
