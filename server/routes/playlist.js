var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(req, res, next) {
  res.sendFile( path.resolve('client/public/views/playlist.html') );
});

module.exports = router;
