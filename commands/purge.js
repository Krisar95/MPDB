const Discord = require('discord.js');
const conf = require('../bconf.json');
const db = require('mongodb').MongoClient;
const uri = conf.uri;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: 'purge',
    alias: [],
    desc: 'Deletes [amount, defaults to 20 if not specified] messages by [bots, images, @mention].',
    params: ['mention', 'type'],
    mod: 1,
    execute: async (message, args) => {
        
        message.delete()

        let amount = args[0]
        if(message.mentions.users.first()) {
            let amount = args.join(" ").slice(22);
            let user = message.mentions.users.first(); 
            await message.channel.messages.fetch({limit: amount}).then(messages => {
                message.channel.bulkDelete(messages);
            })
        }
        await message.channel.messages.fetch({limit: amount}).then(messages => {
            message.channel.bulkDelete(messages);
        })
        
        //let amount = args.join(" ").slice(22)
        //message.channel.bulkDelete(amount)
    }
}