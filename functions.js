const Discord = require('discord.js');
require('dotenv').config()
const fs = require('fs');
const bot = new Discord.Client();
const db = require('mongodb').MongoClient;
const uri = process.env.URI;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.edited = async (oldMessage,newMessage) => {
    if(oldMessage.author.bot) return;
    let logChannel = oldMessage.guild.channels.cache.find(c => c.name === "message-logs")

    const embed = new Discord.MessageEmbed()
    .setTitle("Message edited")
    .setColor("RANDOM")
    .setDescription(`[Jump to message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
    .addFields(
        {name: `From`, value: `${oldMessage.content}`, inline: true},
        {name: `To`, value: `${newMessage.content}`, inline: true},
        {name: `User`, value:`**${oldMessage.author.tag}** (ID: **${oldMessage.author.id}**)`}
    )
    .setFooter(`Message ID: ${oldMessage.id}`)
    
    //console.log(logChannel)

    logChannel.send(embed)
}

exports.deleted = async (message) => {
    if(message.author.bot) return;
    let logChannel = message.guild.channels.cache.find(c => c.name === "message-logs")
    //console.log(message)

    const embed = new Discord.MessageEmbed()
    .setTitle("Message deleted")
    .setColor("RANDOM")
    .setDescription(`Message deleted from <#${message.channel.id}>`)
    .addFields(
        {name: "Contents:", value: `${message.content}`, inline: false},
        {name: "User:", value: `${message.author.tag} (ID: **${message.author.id}**)`, inline: false}
        )
    .setFooter(`Message ID: ${message.id}`)
    logChannel.send(embed);
}