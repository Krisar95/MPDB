const Discord = require('discord.js');
const Warn = require('../models/warn')
const mongoose = require('mongoose');

module.exports = {
    name: "past",
    alias: [],
    desc: "Lists user's past warns",
    mod: 1,
    params: ['@mention/id'],
    execute: async (message, args) => {

            if(!args[0]) throw("No mention or ID specified");
            let mention = message.mentions.users.first()
            if(!mention) mention = message.guild.members.cache.get(args[0])
            if(!mention) throw("ID or mention invalid");

            const q = Warn.find({gid: message.guild.id, usr: mention.id}, function (err, res) {
                if(err) throw(err);

                if(!res) {
                const noPast = new Discord.MessageEmbed()
                .setDescription(`***${mention.tag} has no warnings***`)
                message.channel.send(noPast);
                }
                
                const embed = new Discord.MessageEmbed()
                .setTitle(`${mention.tag}'s warns`)
                .setThumbnail(mention.displayAvatarURL({ dynamic: true }))
                .setFooter(`Member's ID: ${mention.id}`)
                res.forEach(element => {
                   embed.addFields(
                       {name: `Warned by: ${element.mod} | Case ID: ${element.cid}`, value: `${element.rsn} - \`${element.tim}\``}
                   )
                });
                message.channel.send(embed);
            });
    }
}