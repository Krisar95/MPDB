const Discord = require('discord.js');
require('dotenv').config()
const db = require('mongodb').MongoClient;
const uri = process.env.URI;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Discord.Client();

module.exports = {
    name: "warn",
    alias: [],
    desc: "Warns the user",
    mod: 1,
    params: ['@mention/id', 'reason'],
    execute: (message, args) => {
        mongo.connect( async err => {
            const db = mongo.db("mpdp");
            const cursor = db.collection("mpdp_warns")

            let channel = message.guild.channels.cache.find(channel => channel.name === "mod-logs");

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
            channel.send(log);
            let i = 0;
            await cursor.insertOne({uid : `${mention.id}`, reason: `${reason}`, moderator: `${message.author.tag}`, caseno: `${message.id}`})

        })
    }
}
