var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SHA256 = require("crypto-js/sha256");
var statusCode = require("../bin/status_code");

var ConversationSchema = new Schema({
        users: [Schema.ObjectId],
        created: {type: Date, default: Date.now}
    },
    {
        versionKey: false
    }
);

ConversationSchema.pre('validate', function (next) {
    var error = new Error();

    // Check if there are min 2 users in conversation
    if (this.users.length < 2) {
        error.statusCode = statusCode.HTTP_BAD_REQUEST;
        error.message = 'Invalid number of users in conversation: ' + this.users.length;
        return next(error)
    }

    // Check if there are no duplicated ids in request
    for (var i = 0; i < this.users.length; i++) {
        for (var j = 0; j < this.users.length; j++) {
            
            if (this.users[i].toString() == this.users[j].toString() && i != j) {
                error.statusCode = statusCode.HTTP_BAD_REQUEST;
                error.message = 'Duplicated users ids at indexes ' + i + ' ' + ' and ' + j;
                console.log('ERROR');
                return next(error)
            }
        }
    }

    // Check if users ids are valid ObjectId
    for (var i = 0; i < this.users.length; i++) {
        if (!mongoose.Types.ObjectId.isValid(this.users[i])) {
            error.statusCode = statusCode.HTTP_BAD_REQUEST;
            error.message = 'User id id not valid ObjectId. Id: ' + this.users[i];
            return next(error)
        }
    }

    next();
});

var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;