var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');
var statusCode = require("../bin/status_code");

router.get('/', function (req, res, next) {

    User.find(function (err, users) {
        if (err) { return next(err); }

        res.json(users);
    })

});

router.get('/me', function (req, res, next) {
    var token = req.header('token');
    
    Token.findOne({token: token}, function (err, aToken) {
        if (err) { return next(err) }
        if (!aToken) {
            return next({
                status: statusCode.HTTP_NOT_FOUND,
                message: 'Token ' + token + ' not found.'
            })
        }

        User.findOne({_id: aToken.user_id}, function (err, aUser) {
            if (err) { return next(err) }
            if (!aUser) {
                return next({
                    status: statusCode.HTTP_NOT_FOUND,
                    message: 'User not found'
                })
            }

            res.status(statusCode.HTTP_OK).json(aUser);
        });
    })

});

router.post('/login', function (req, res) {

    var pLogin = req.body.login;
    var pPassword = req.body.password;

    User.findOne({login: pLogin}, function (err, user) {
        if (err) { return next(err) }

        if (!user) {
            return next({
                statusCode: statusCode.HTTP_NOT_FOUND,
                message: 'User ' + pLogin + ' not found'
            })
        }

        if (!user.comparePassword(pPassword)) {
            return next({
                statusCode: statusCode.HTTP_UNAUTHORIZED,
                message: 'Wrong password'
            })
        }

        var token = new Token({user_id: user._id});

        token.save(function (err, savedToken) {
            if (err) { return next(err) }

            res.status(statusCode.HTTP_OK).json({
                user_id: savedToken.user_id,
                token: savedToken.token
            });
        });

    })
});

router.post('/register', function (req, res, next) {

    var user = new User({
        login: req.body.login,
        password: req.body.password
    });

    user.save(function (err, savedUser) {
        if (err) { return next(err) }

        var token = new Token({user_id: savedUser._id});

        token.save(function (err, savedToken) {
            if (err) {return next(err)}

            res.status(statusCode.HTTP_CREATED).json({
                user_id: savedToken.user_id,
                token: savedToken.token
            });
        });
    })
});

module.exports = router;
