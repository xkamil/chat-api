var express = require('express');
var path = require('path');
var logger = require('morgan-body');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat-api');

var authentication_mid = require('./middleware/authentication_mid');
var users = require('./routes/users');
var error_handler_mid = require('./middleware/error_handler');

var app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

logger(app);

// Authorization middleware
app.use(authentication_mid);

// Routes
app.use('/users', users);

// Error handler
app.use(error_handler_mid);

module.exports = app;
