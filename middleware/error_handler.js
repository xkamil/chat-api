var express = require('express');

module.exports = function(err, req, res, next) {

    var env = req.app.get('env') || 'production';

    res.status(err.statusCode || 500);

    res.json({
        code: err.code || 0,
        message: err.message || ''
    });
};

