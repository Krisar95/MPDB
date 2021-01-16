const mongoose = require('mongoose');

const qSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gid: String,
    songQ: [{url: String, added: String}]
});

module.exports = mongoose.model('Queue', qSchema, 'queues');