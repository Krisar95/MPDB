const { Discord, MessageEmbed } = require('discord.js');
const func = require('../functions');
const Q = require('../models/songQueue');

module.exports = {
    name: "stop",
    params: [],
    desc: "Stops playback and disconnects bot",
    mod: 0,
    execute: async (bot, message, args) => {

        var server = servers[message.guild.id];

        if(message.member.voice.channel) {
            for (let i = 0; i < server.queue.length; i++) {
                server.queue.splice(i, 1);   
            }
            queue.dispatcher.end();
            console.log("Fin!")

        }

        if(message.guild.connection) message.guild.voice.channel.leave()

    }
}