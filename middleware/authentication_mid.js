var express = require('express');
var statusCode = require("../bin/status_code");

module.exports = function (req, res, next) {

    if(req.url !== '/users/login' && req.url!== '/users/register'){
        if(!req.header('token')){
            //TODO validate if token exists
            res.status(statusCode.HTTP_UNAUTHORIZED).json();
        }else{
            next();
        }
    }else{
        next();
    }
};
