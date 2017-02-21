var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SHA256 = require("crypto-js/sha256");
var statusCode = require("../bin/status_code");
var User = require('./user');

var TokenSchema = new Schema({
        user_id: {
            type: Schema.ObjectId,
            required: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        created: {type: Date, default: Date.now}
    },
    {
        versionKey: false
    }
);

TokenSchema.pre('validate', function (next) {
    var error = new Error();

    if (!mongoose.Types.ObjectId.isValid(this.user_id)) {
        error.statusCode = statusCode.HTTP_BAD_REQUEST;
        error.code = statusCode.INVALID_USER_ID;
        error.message = 'Invalid user id';
        next(error)
    } else {
        this.token = SHA256(this.user_id + Date.now.getMilliseconds + Math.random()).toString();
        next();
    }
});

TokenSchema.methods.getUser = function (callback) {
    User.findOne({_id: this.user_id}, function (err, aUser) {
        if (err) {
            callback(err);
        } else if (aUser) {
            callback(null, aUser);
        } else {
            callback({
                statusCode: statusCode.HTTP_NOT_FOUND,
                message: 'User with id ' + this.user_id + ' not found'
            });
        }
    })
};


var Token = mongoose.model('Token', TokenSchema);

module.exports = Token;