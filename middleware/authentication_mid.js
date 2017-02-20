var express = require('express');
var statusCode = require("../bin/status_code");
var Token = require('../models/token');

module.exports = function (req, res, next) {
    var token = req.header('token');

    if(req.url !== '/users/login' && req.url!== '/users/register'){
        if(!token){
            res.status(statusCode.HTTP_UNAUTHORIZED).json();
        }else{
            Token.findOne({token: token}, function (err, aToken) {
                if(err || !aToken) {
                    next({
                        statusCode: statusCode.HTTP_UNAUTHORIZED,
                        message: 'Bad or expired token'
                    });
                }else{
                    next();
                }
            });
        }
    }else{
        next();
    }
};
