const Discord = require('discord.js');

module.exports = {
    name: 'purge',
    alias: [],
    desc: 'Deletes [amount(required)] messages by [bots, @mention].',
    params: ['mention', 'type'],
    mod: 1,
    execute: async (message, args) => {

        let channel = message.guild.channels.cache.find(c => c.name === "message-logs");
        let mention = message.mentions.users.first();
        let amount = args[1]
        if(!amount) return message.channel.send("Please provide number of messages")
        message.channel.messages.fetch({limit: amount})
        .then(fetchedMessages => {
            console.log(fetchedMessages)
            let toDelete = null;
            if(!args[1]) toDelete = fetchedMessages.filter(message => (message))
            if(args[0] == mention) toDelete = fetchedMessages.filter(message => (message.author.id == mention.id))
            if(args[0] == "bots") toDelete = fetchedMessages.filter(message => (message.author.bot))
            return message.channel.bulkDelete(toDelete, true);
        })
        .then(deletedMessages => channel.send(`Deleted **${deletedMessages.size}** message${deletedMessages.size !== 1 ? 's' : ''} from <#${message.channel.id}>.`))
    }
}