const Discord = require('discord.js');
const tokenfile = require('../tokenfile.json');
const db = require('mongodb').MongoClient;
const uri = tokenfile.uri;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: 'clear',
    alias: [],
    desc: 'Deletes 99 messages of any kind from the channel',
    mod: 1,
    execute(message, args) {
        message.delete()
        message.channel.send("Cleared chat.")
        message.channel.bulkDelete(99)
    }
}