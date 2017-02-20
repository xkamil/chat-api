var express = require('express');

module.exports = function(err, req, res, next) {

    res.status(err.statusCode || 500);

    res.json({
        code: err.code || 0,
        message: err.message || ''
    });

};

