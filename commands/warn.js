const Discord = require('discord.js');
const mongoose = require('mongoose')
const Warn = require('../models/warn')

module.exports = {
    name: "warn",
    alias: [],
    desc: "Warns the user",
    mod: 1,
    params: ['@mention/id', 'reason'],
    execute: async (message, args) => {

        let channel = message.guild.channels.cache.find(channel => channel.name === "moderation-logs");
        if(!channel) {
            let cat = message.guild.channels.cache.find(channel => channel.name === "Bot logs")
            let roleid = message.guild.member(message.author).roles.highest;
            let botrole = message.guild.roles.cache.find(r => r.name === "MBDB");
            let guild = message.guild
            
            await message.guild.channels.create("moderation-logs", {
              type: 'text',
              parent: cat.id,
              permissionOverwrites: [
                {
                  id: guild.id,
                  deny: ['VIEW_CHANNEL']
                },
    
                {
                  id: roleid,
                  allow: ["VIEW_CHANNEL"]
                },
                
                {
                  id: botrole.id,
                  allow: ['VIEW_CHANNEL'] 
                }
              ]
            });
    
            message.author.send("As I didn't find a moderation log channel, I created one under the `Bot logs` category. Remember to set the correct permissions! \n\nHere's how you do that: \nhttps://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-")
        }

        let reason = args.join(" ").slice(23);
        if (!reason) throw("You need to specify a reason.")

        if(!args[0]) throw("No mention or ID specified");
        let mention = message.mentions.users.first()
        if(!mention) mention = message.guild.members.cache.get(args[0])
        if(!mention) throw("ID or mention invalid");

        const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(`***${mention.tag} was warned and tagged with ID ${message.id}***`)
        message.channel.send(embed);

        const log = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("New warning registered")
        .setDescription(`${mention.tag} (ID: ${mention.id}) was warned`)
        .addFields(
            { name: "Reason", value: `${reason}`, inline: true },
            { name: "Moderator", value: `${message.author.tag}`, inline: true }
        )
        .setFooter(`Message ID: ${message.id}`)
        channel.send(log)

        wObj = new Warn({
           _id: mongoose.Types.ObjectId(),
           gid: message.guild.id,
           mod: message.author.tag,
           usr: mention.id,
           cid: message.id,
           rsn: reason,
           tim: message.createdAt.toLocaleString()
        })

        wObj.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));
        console.log("New warning logged")

    }
}
