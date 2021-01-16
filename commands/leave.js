const Discord = require('discord.js');

module.exports = {
    name    : "leave",
    params  : [],
    desc    : "Leaves the voice channel",
    mod     : 0,
    execute : async (bot, message, args) => {
        
        message.react(`✌`)
        message.guild.voice.channel.leave()

    }
}