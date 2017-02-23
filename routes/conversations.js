var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');
var Conversation = require('../models/conversation2');
var statusCode = require("../bin/status_code");
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {

    Conversation.find(function (err, conversations) {
        if (err) { return next(err); }
        res.json(conversations);
    });

});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(
            {
                statusCode: statusCode.HTTP_NOT_FOUND,
                message: 'Invalid conversation id provided. Id: ' + id
            }
        );
    }

    Conversation.findOne()
        .where({_id: id})
        .exec(function (err, conversation) {
            if (err) { return next(err); }
            if (!conversation) {
                return next(
                    {
                        statusCode: statusCode.HTTP_NOT_FOUND,
                        message: 'Conversation with id: ' + id + ' not found.'
                    }
                );
            }
            res.json(conversation);
        })
});

router.post('/withUsers', function (req, res, next) {
    var token = req.header('token');
    var users = req.body;
    var user_id = req.p_user_id;

    try {
        users.push(user_id);
    } catch (e) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: 'Request payload should be a json array'
        })
    }

    // Check if users ids are valid
    for (var i = 0; i < users.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(users[i])) {
            return next({
                statusCode: statusCode.HTTP_BAD_REQUEST,
                message: 'User id id not valid ObjectId. Id: ' + users[i]
            })
        }
    }

    Conversation.find({"users": {$all: users}}, function (err, conversations) {
        if (err) { return next(err); }
        res.json(conversations);
    })
});

router.post('/withUsers/strict', function (req, res, next) {
    var token = req.header('token');
    var users = req.body;
    var user_id = req.p_user_id;

    try {
        users.push(user_id);
    } catch (e) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: 'Request payload should be a json array'
        })
    }

    // Check if users ids are valid
    for (var i = 0; i < users.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(users[i])) {
            return next({
                statusCode: statusCode.HTTP_BAD_REQUEST,
                message: 'User id id not valid ObjectId. Id: ' + users[i]
            })
        }
    }

    Conversation.findOne({"users": {$all: users,$size: users.length}}, function (err, conversations) {
        if (err) { return next(err); }
        if (!conversations) {
            return next({
                statusCode: statusCode.HTTP_NOT_FOUND,
                message: 'Conversation with 2 users not found'
            })
        }
        res.json(conversations);
    })
});

router.post('/', function (req, res, next) {
    var token = req.header('token');
    var users = req.body;
    var user_id = req.p_user_id;

    try {
        users.push(user_id);
    } catch (e) {
        return next({
            statusCode: statusCode.HTTP_BAD_REQUEST,
            message: 'Request payload should be a json array'
        })
    }

    Conversation.findOne({"users": {$all: users, $size: users.length}}, function (err, conversation) {
        if (err) { return next(err); }
        if (conversation) {
            return next({
                statusCode: statusCode.HTTP_CONFLICT,
                message: 'Conversations with users already exists'
            })
        }

        var newConversation = new Conversation({
            users: users
        });

        newConversation.save(function (err) {
            if (err) { return next(err); }

            return res.status(statusCode.HTTP_CREATED).json();
        })
    })

});

module.exports = router;
