const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    alias: [],
    desc: 'Bans a user from the server',
    params: ['mention', 'reason'],
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
    

        // No mention, no id or invalid args
        
        if(!args[0]) throw("No mention or ID specified");
        let mention = message.mentions.users.first()
        if(!mention) mention = message.guild.members.cache.get(args[0])
        if(!mention) throw("ID or mention invalid");

        // ban user and log incident in channel

        
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
        channel.send(log)
    }
}