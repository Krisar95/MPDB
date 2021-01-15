const Discord = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("../models/guild");

module.exports = {
    event: "guildDelete",
    once: false,
    run: async (guild) => {

        const q = {gid: guild.id};

        Guild.deleteOne(q, function(err) {
            if(err) console.log(err)
            console.log(`Left guild: ${guild.name}`);
        })
        
/*
        const embed = new Discord.MessageEmbed()
        .setAuthor("Thanks for adding me to your server!")
        .setColor("GREEN")
        .setDescription("To start off, here's a couple things you should know.\nBy the way, feel free to watch my development happen on (github!)[https://github.com/Krisar95/MPDB/]")
        .addFields(
            { name: "My default prefix", value: guildObj.defaultPrefix, inline: false },
            { name: "Command list", value: `Type ${guildObj.defaultPrefix}help to have me send you a list of my commands!`, inline: false },
            { name: "Regarding logging", value: `I create the log channels I need myself\nfor message logging (editing and deletion of messages) and for moderation logging (mutes, kicks, bans and warns).`, inline: true}
        )
        .setFooter(`Your ID is: ${guild.ownerID}`)
        .setTimestamp()

        guild.owner.send(embed)
  */      
    }
}
