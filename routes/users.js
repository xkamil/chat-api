var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');
var statusCode = require("../bin/status_code");

router.get('/', function (req, res, next) {
    User.find(function (err, users) {

        if (err) {
            next({message: err});
        } else {
            res.json(users);
        }
    })
});

router.get('/:id', function (req, res, next) {

    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId') {
                next({
                    statusCode: statusCode.HTTP_NOT_FOUND
                })
            } else {
                next(err);
            }
        } else if (user) {
            res.json(user);
        } else {
            res.status(statusCode.HTTP_NOT_FOUND).end();
        }
    });

});

router.post('/login', function (req, res, next) {

    var pLogin = req.body.login;
    var pPassword = req.body.password;

    User.findOne({login: pLogin}, function (err, user) {
        if (err) {
            next(err);
        } else if (user) {
            if (user.comparePassword(pPassword)) {

                var token = new Token({
                    user_id: user._id
                });

                token.save(function (err, savedToken) {
                    if (err) {
                        next(err);
                    } else {
                        res.status(statusCode.HTTP_OK).json({
                            user_id: savedToken.user_id,
                            token: savedToken.token
                        });
                    }
                });

            } else {
                next({
                    statusCode: statusCode.HTTP_UNAUTHORIZED,
                    message: 'Wrong password'
                })
            }
        } else {
            next({
                statusCode: statusCode.HTTP_UNAUTHORIZED,
                message: 'User ' + pLogin + ' is not registered'
            })
        }
    })
});

router.post('/register', function (req, res, next) {

    var user = new User({
        login: req.body.login,
        password: req.body.password
    });

    user.save(function (err, savedUser) {
        if (err) {
            next(err);
        } else {

            var token = new Token({
                user_id: savedUser._id
            });

            token.save(function (err, savedToken) {
                if (err) {
                    next(err);
                } else {
                    res.status(statusCode.HTTP_CREATED).json({
                        user_id: savedToken.user_id,
                        token: savedToken.token
                    });
                }
            });
        }
    })
});

module.exports = router;
