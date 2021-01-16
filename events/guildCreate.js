const Discord = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("../models/guild");
const Q = require("../models/songQueue");

module.exports = {
    event: "guildCreate",
    once: false,
    run: async (guild) => {
        const guildObj = new Guild({
            _id: mongoose.Types.ObjectId(),
            gid: guild.id,
            gname: guild.name,
            defaultPrefix: "$"
        });
    
        guildObj.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));

        const q = new Q({
            _id     : mongoose.Types.ObjectId(),
            gid     : guild.id,
            songQ   : []
        });
        
        q.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));

        const guildJoin = {
            name: `${guild.name}`,
            size: `${guild.memberCount}`,
            region: `${guild.region}`
        }
        
        console.log(guildJoin);
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



