const Discord = require('discord.js');
require('dotenv').config()
const func = require('./functions');
const db = require('mongodb').MongoClient;
const uri = process.env.URI;
const token = process.env.TOKEN;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Discord.Client();

func.fetchCommands();

mongo.connect(async err => {

  const db = mongo.db("mpdp");
  const cursor = db.collection("mpdp_config")
  const res = await cursor.findOne({})

  var version = "1.1";
  // lets you know the bot is online and ready to be used
  bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity(`Alpha 0.275.26 (${res.prefix})`, {
        type: "WATCHING"
      }
    );
  });


    bot.on('messageUpdate', async(oldMessage, newMessage) => {

      func.edited(oldMessage,newMessage);

    });

    bot.on('messageDelete', async message => {

      func.deleted(message);

    });
      
    bot.on('guildMemberAdd', async member => {
      let channel = bot.channels.cache.find(channel => channel.name === "general")
      const welcome = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`:tada: Welcome <@${member.id}>! You're member number ${guild.memberCount}.`)
      bot.channels.cache.get(channel.id).send(welcome);
    });

    bot.afk = new Map();
    bot.mem = new Map();


    bot.on('message', async message => {
      if(message.author.bot) return;
      if(!message.guild) return;
      if(!message.content.startsWith(res.prefix)) return;
      if(message.guild.id !== "653024881348182016") return message.channel.send("I'm currently being rewritten, my commands are useless here.")
      // Command handler
      func.runCommands(message);
      // End command handler
    });

});

bot.login(token);