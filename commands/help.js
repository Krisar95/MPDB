const { Discord, MessageEmbed } = require('discord.js');
const mongoose = require("mongoose");
const fs = require('fs');

module.exports = {
    name: "help",
    alias: [],
    params: [],
    desc: "Displays this command list",
    mod: 0,
    execute: async (message, args) => {
        
        message.react(`✅`);
        
        fs.readdir("./commands", (err, files) => {
            if(err) console.log(err);
                let jsFile = files.filter(f => f.split(".").pop() === "js")
                if(jsFile.length <= 0) {
                console.log("Couldn't find any commands!")
                return;
            }

            const list = new MessageEmbed()
            .setTitle("MPDB's command list")
            .setColor("RANDOM")
            .setDescription("Here's a list of all of my commands, along with their description!")
            .setFooter(`Requested by ${message.author.tag}`)
            .setTimestamp()
          
            jsFile.forEach((f, i) => {
                let props = require(`./${f}`);
                if(props.mod && message.guild.member(message.author).hasPermission("KICK_MEMBERS")) {
                    list.addFields({
                        name: `${props.name}`,
                        value: `${props.desc} | Params: **[${props.params}]**`,
                        inline: false
                    })
                }
            });
            message.author.send(list);
        });
    }
}