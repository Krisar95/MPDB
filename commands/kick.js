const Discord = require('discord.js');
const tokenfile = require('../tokenfile.json');

module.exports = {
    name: 'kick',
    alias: [],
    desc: 'Kicks a user from the server',
    params: ['mention', 'reason'],
    mod: 1,
    execute(message, args) {
        // No mention, no id or invalid args
        
        if(!args[0]) throw("No mention or ID specified");
        let mention = message.mentions.users.first()
        if(!mention) mention = message.guild.members.cache.get(args[0])
        if(!mention) throw("ID or mention invalid");

        // Kick user and log incident in channel

        let channel = message.guild.channels.cache.find(channel => channel.name === "mod-logs");
        let reason = args.join(" ").slice(22);
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`**✅ successfully kicked ${mention.tag}**`)
        message.channel.send(embed);

        const log = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor("Member kicked")
        .setDescription(`**${mention.tag} (ID: ${mention.id}) was kicked**`)
        .addFields({name:"Moderator", value:`${message.author}`, inline: true}, {name:"Reason", value:`${reason}`, inline: true})
        .setFooter(`ID: ${message.author.id}`)
        message.guild.channels.cache.get(channel.id).send(log)
    }
}