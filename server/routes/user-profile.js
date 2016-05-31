var express = require('express'),
    router = express.Router(),
    /*
      'path' is needed because relative paths ../../ are considered malicious
      when importing modules in node. Example: importing routes in index.js
    */
    path = require('path');

var User = require("../models/user.js");

router.get('/', function(req, res, next) {

  res.sendFile( path.resolve('client/public/views/user-profile.html') );
});

router.get("/myself/:email", function(req, res){
  User.find( { email: req.params.email }, function(err, user){
    if(err) throw err

    if(user && user.length !== 0  ){
      res.json( user );
    } else {
      res.json({ error: "User not saved" });
    }

  } )
});

module.exports = router;
