var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');
var Sentence = require('../models/sentence');
var statusCode = require("../bin/status_code");
var mongoose = require('mongoose');


router.get('/:conversationId/sentences', function (req, res, next) {
    var conversationId = req.params.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: 'Invalid conversation id'
        })
    }

    Sentence.find()
        .where({conversation_id: conversationId})
        .exec(function (err, sentences) {
            if (err) { return next(err); }
            res.json(sentences);
        })
});

router.post('/:conversationId/sentences', function (req, res, next) {

    var user_id = req.p_user_id;
    var conversationId = req.params.conversationId;
    var content = req.body.content;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: 'Invalid conversation id'
        })
    }

    if (!content || content.trim().length == 0) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: "Content can't be empty"
        })
    }

    var sentence = new Sentence({
        user_id: user_id,
        content: content,
        conversation_id: conversationId
    });

    sentence.save(function (err, savedSentence) {
        if (err) { return next(err) }

        res.status(statusCode.HTTP_OK).json({
            id: savedSentence._id
        });
    });
});

module.exports = router;
