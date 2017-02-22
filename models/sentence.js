var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SentenceSchema = new Schema({
        conversation_id: {
            type: Schema.ObjectId,
            required: true
        },
        user_id: {
            type: Schema.ObjectId,
            required: true
        },
        content: String,
        created: {type: Date, default: Date.now}
    },
    {
        versionKey: false
    }
);

var Sentence = mongoose.model('Sentence', SentenceSchema);

module.exports = Sentence;