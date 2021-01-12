const Discord = require('discord.js');
const tokenfile = require('../bconf.json');
const db = require('mongodb').MongoClient;
const uri = tokenfile.uri;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ms = require('ms');

module.exports = {
    name: 'mute',
    alias: [],
    desc: 'Mutes a user',
    params: ['mention', 'duration'],
    mod: 1,
    execute(message, args) {
        if(!args[0]) throw("No mention or ID specified")
        let mention = message.mentions.users.first()
        if(!mention) mention = message.guild.members.cache.get(args[0])
        if(!mention) throw("Mention or ID invalid")

        let duration = args.join(" ").slice(22)
        if(!duration) throw("Duration wasn't specified")
        const mrole = message.guild.roles.cache.find(r => r.name === "Muted");
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`**${mention.tag} was muted**`)
        message.channel.send(embed);
        mention.roles.add(mrole.id);

        let channel = message.guild.channels.cache.find(channel => channel.name === "mod-logs");
        
        const log = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor("Member muted")
        .setDescription(`**${mention.tag} was muted for ${duration}**`)
        .addFields( { name:"Moderator", value: `${message.author} (ID: ${message.author.id})`, inline:false } )
        message.guild.channels.cache.get(channel.id).send(log);
    }
}