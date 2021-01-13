const Discord = require('discord.js');
require('dotenv').config()
const func = require('./functions');
const db = require('mongodb').MongoClient;
const fs = require('fs');
const { Server } = require('http');
const uri = process.env.URI;
const token = process.env.TOKEN;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Discord.Client();
mongo.connect(async err => {


  fs.readdir("./commands", (err, files) => {
      if(err) console.log(err);
      let jsFile = files.filter(f => f.split(".").pop() === "js")
      if(jsFile.length <= 0) {
      console.log("Couldn't find any commands!")
      return;
      }
    
      // Loops through the /commands/ folder to find out what commands are there and usable
      jsFile.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded successfully.`);
      bot.commands.set(props.name, props)
      bot.other.set(props.alias, props)
      });
    });

  bot.commands = new Discord.Collection();
  bot.other = new Discord.Collection();


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
      let channel = message.guild.channels.cache.find(channel => channel.name === "message-logs" );
      
      if(!channel) {
        message.guild.channels.create("message-logs");
        message.channel.send("As I didn't find a message logs channel, I created one.")
      }

      if(!message.content.startsWith(res.prefix)) return;
      //if(message.guild.id !== "653024881348182016") return message.channel.send("I'm currently being rewritten, my commands are useless here.")

      let args = message.content.slice(res.prefix.length).trim().split(/ +/);
      let cmd = args.shift().toLowerCase();
      if (!cmd.length) return;
      let command = bot.commands.get(cmd);
      // Start command handler 
      try {
        if(command.mod && !message.member.hasPermission("KICK_MEMBERS")) throw("You don't have the perms to use this command");
        command.execute(message, args);
      } catch (e) {
        const error = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor("Error 🛑")
        .setDescription(`Error running ${command.name}: `)
        .addFields({name: "Error message:", value: e, inline: false}, {name:"Required parameters:", value: command.params, inline: false })
  
        message.channel.send(error)
      }
      // End command handler
      
    });

});

bot.login(token);