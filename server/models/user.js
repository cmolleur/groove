var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // password: { type: String },
  friends: { type: Array }
}, { timestamps: true });

UserSchema.pre('save', function(next){
  if( this.isModified('password') ){
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.authenticate = function(passwordTry){
  return bcrypt.compareSync(passwordTry, this.password);
};

module.exports = mongoose.model('User', UserSchema);
