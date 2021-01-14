const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    alias: [],
    desc: 'Deletes 99 messages of any kind from the channel',
    mod: 1,
    execute(message, args) {
        message.channel.send("Nope")
    }
}