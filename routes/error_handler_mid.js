var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
    console.log('invoked');
    next(err);
});

module.exports = router;