const { Discord } = require('discord.js')
const mongoose = require("mongoose")

module.exports = {
    name: "join",
    params: [],
    desc: "Joins the voice channel the user is in",
    mod: 0,
    execute: async (bot, message, args) => {

        if (message.member.voice.channel) {
            await message.member.voice.channel.join().then(conn => {
                message.react(`✅`)
                console.log(`Joined ${conn.channel.name}`)
                console.log(bot.voice.connections);
            })
        } else {
            message.react(`❌`)
            message.reply('You need to join a voice channel first!');
        }
        
    }
}