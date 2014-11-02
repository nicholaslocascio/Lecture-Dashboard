/*
General logic for handling user authentication
*/

var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt'); // Used for hashing passwords
var model = require('../data/model');
var router = express.Router();



module.exports = router;
