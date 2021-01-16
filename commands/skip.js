const { Discord, MessageEmbed } = require('discord.js');
const func = require('../functions');
const Q = require('../models/songQueue');

module.exports = {
    name: "skip",
    params: [],
    desc: "Skips the song that is currently playing",
    mod: 0,
    execute: async (bot, message, args) => {

        const queue = await Q.findOne({gid: message.guild.id})
        
        if(queue.dispatcher) queue.dispatcher.end();

    }
}