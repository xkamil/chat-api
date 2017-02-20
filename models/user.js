var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SHA256 = require("crypto-js/sha256");
var statusCode = require("../bin/status_code");

var UserSchema = new Schema({
        login: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        created: {type: Date, default: Date.now}
    },
    {
        versionKey: false
    }
);

UserSchema.methods.comparePassword = function (candidatePassword) {
    candidatePassword = SHA256(candidatePassword).toString();
    if(this.password === candidatePassword){
        return true;
    }else{
        return false;
    }
};

UserSchema.pre('save', function (next) {
    var error = new Error();

    if (!this.password || this.password.length < 5) {
        error.statusCode = statusCode.HTTP_BAD_REQUEST;
        error.code = statusCode.PASSWORD_TOO_SHORT;
        error.message = 'Password is too short';
        next(error)
    } else if (!this.login || this.login.length < 5) {
        error.statusCode = statusCode.HTTP_BAD_REQUEST;
        error.code = statusCode.LOGIN_TOO_SHORT;
        error.message = 'Login is too short';
        next(error)
    } else {
        this.password = SHA256(this.password).toString();
        next();
    }
});

UserSchema.post('save', function (error, doc, next) {

    if (error.name === 'MongoError' && error.code === 11000) {
        var newError = new Error();
        newError.message = 'Login alredy taken';
        newError.statusCode = statusCode.HTTP_CONFLICT;

        next(newError)
    } else {
        next(error);
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;