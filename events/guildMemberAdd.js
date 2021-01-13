const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    event: "guildMemberAdd",
    once: "false",
    run: async (member, message) => {
        let guild = message.guild
        let channel = guild.channels.cache.find(channel => channel.name === "general")
        const welcome = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`:tada: Welcome <@${member.id}>! You're member number ${guild.memberCount}.`)
        channel.send(welcome);
    }
}