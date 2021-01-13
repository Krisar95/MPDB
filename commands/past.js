const Discord = require('discord.js');
require('dotenv').config()
const db = require('mongodb').MongoClient;
const uri = process.env.URI;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Discord.Client();

module.exports = {
    name: "past",
    alias: [],
    desc: "Lists user's past warns",
    mod: 1,
    params: ['@mention/id'],
    execute: (message, args) => {
        mongo.connect( async err => {
            if(!args[0]) throw("No mention or ID specified");
            let mention = message.mentions.users.first()
            if(!mention) mention = message.guild.members.cache.get(args[0])
            if(!mention) throw("ID or mention invalid");

            const query = { uid: `${mention.id}` };
            console.log(query)
            const db = mongo.db("mpdp");
            const cursor = db.collection("mpdp_warns").find({uid: `${mention.id}`})
            //console.log(await cursor.count()) //add this here to see if its a problem with the query
            if(await cursor.count() === 0) {
                const noPast = new Discord.MessageEmbed()
                .setDescription(`***${mention.tag} has no warnings***`)
                message.channel.send(noPast);
                return;
            }

            const embed = new Discord.MessageEmbed()
            .setTitle(`${mention.tag}'s warns`)
            .setThumbnail(mention.displayAvatarURL({ dynamic: true }))
            .setFooter(`Member's ID: ${mention.id}`)
            let array = await cursor.toArray();
            for (let i = 0; i < array.length; i++) {
                embed.addFields({name: `Warned by: ${array[i].moderator} | Case ID: ${array[i].caseno}`, value: `${array[i].reason}`, inline: false})
            }
        
            message.channel.send(embed);
            
            if(err) console.log(err)
        })
    }
}