var dotEnv          = require('dotenv').config(),
    express         = require('express'),
    morgan          = require('morgan'),
    passport        = require('./server/lib/passportStrategy.js'),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    app             = express(),
    indexRouter     = require('./server/routes/index.js'),
    userRouter      = require('./server/routes/user-profile.js'),
    playlistRouter  = require('./server/routes/playlist.js'),

    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);


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

var userRouter = require('./server/routes/user-profile.js');
app.use('/user-profile', userRouter);

var playlistRouter = require('./server/routes/playlist.js');
app.use('/playlist', playlistRouter);

// Set static file root folder
app.use(express.static('client/public'));

app.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

var port = process.env.PORT || 8080;

app.listen( port, function(){
  console.log( 'Free margaritas on Port:8080' );
});
