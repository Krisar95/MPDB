const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    alias: [],
    desc: 'Mutes a user',
    params: ['mention', 'duration'],
    mod: 1,
    execute: async (bot, message, args) => {

        let channel = message.guild.channels.cache.find(channel => channel.name === "moderation-logs");
        if(!channel) {
            let cat = message.guild.channels.cache.find(channel => channel.name === "Bot logs")
            let botrole = message.guild.roles.cache.find(r => r.name === "MBDB");
            let roleid = message.member(message.author).roles.highest;
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
        
        const log = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setAuthor("Member muted")
        .setDescription(`**${mention.tag} was muted for ${duration}**`)
        .addFields( { name:"Moderator", value: `${message.author} (ID: ${message.author.id})`, inline:false } )
        channel.send(log);
    }
}