const Discord = require('discord.js');
const Guild = require('../models/guild')

module.exports = {
    name: 'prefix',
    alias: [],
    desc: 'Changes the default prefix for this guild',
    mod: 1,
    execute: async (message, args) => {
        if(!args) throw("You have to supply a new prefix!")
        
        const doc = await Guild.findOne({gid: `${message.guild.id}`});
        const update = {defaultPrefix: `${args[0]}`};
        await doc.updateOne(update)
        
        const embed = new Discord.MessageEmbed()
        .setDescription(`*** Prefix now set to \`${args[0]}\` ***`)
        .setColor("GREEN")
        message.channel.send(embed);
    }
}