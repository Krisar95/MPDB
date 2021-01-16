const { Discord, MessageEmbed } = require('discord.js');
const func = require('../functions');
const ytdl = require('ytdl-core');
const Q = require('../models/songQueue');

module.exports = {
    name    : "play",
    params  : ["url", "search string coming soon"],
    mod     : 0,
    desc    : "Plays a song from passed URL",
    execute : async (bot, message, args) => {

        if(!bot.servers[message.guild.id]) bot.servers[message.guild.id] = {
            queue: {url: String, title: String, addedBy: String}
        }

        let videoID = ytdl.getURLVideoID(args[0])
        let songTitle = ytdl.getInfo(videoID)
        var server = servers[message.guild.id];

        server.queue.push({url: args[0], title: songTitle, addedBy: message.author.tag});

        if (message.member.voice.channel) { 
                await message.member.voice.channel.join().then( async (connection) => {

                    func.play(connection, message)

                })
        } else {
            message.react(`❌`)
            message.reply('You need to join a voice channel first!');
        }
    }
}