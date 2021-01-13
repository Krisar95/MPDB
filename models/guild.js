const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gid: String,
    gname: String,
    defaultPrefix: String
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');