const Discord = require('discord.js');
const tokenfile = require('../bconf.json');
const db = require('mongodb').MongoClient;
const uri = tokenfile.uri;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: 'ban',
    alias: [],
    desc: 'Bans a user from the server',
    params: ['mention', 'reason'],
    mod: 1,
    execute(message, args) {
        // No mention, no id or invalid args
        
        if(!args[0]) throw("No mention or ID specified");
        let mention = message.mentions.users.first()
        if(!mention) mention = message.guild.members.cache.get(args[0])
        if(!mention) throw("ID or mention invalid");

        // ban user and log incident in channel

        let channel = message.guild.channels.cache.find(channel => channel.name === "mod-logs");
        let reason = args.join(" ").slice(22);
        if (!reason) reason = "None specified"
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`**✅ successfully banned ${mention.tag} (ID: ${mention.id})**`)
        message.channel.send(embed);

        const log = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor("Member banned")
        .setDescription(`**${mention.tag} (ID: ${mention.id}) was banned**`)
        .addFields({name:"Moderator", value:`${message.author}`, inline: true}, {name:"Reason", value:`${reason}`, inline: true})
        .setFooter(`ID: ${message.author.id}`)
        message.guild.channels.cache.get(channel.id).send(log)
    }
}