const mongoose = require('mongoose');

const warnSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gid: String,
    mod: String,
    usr: String,
    cid: String,
    rsn: String,
    tim: String
});

module.exports = mongoose.model('Warn', warnSchema, 'warns');