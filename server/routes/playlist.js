var express = require('express'),
    router = express.Router(),
    path = require('path');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

router.get('/', function(req, res, next) {
  res.sendFile( path.resolve('client/public/views/playlist.html') );
});


router.get('/:id', function(req, res, next) {
  //query spotify
  console.log( 'hey');
  res.sendFile( path.resolve('client/public/views/playlist.html') );
});

module.exports = router;
