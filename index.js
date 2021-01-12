const Discord = require('discord.js');
const tokenfile = require('./tokenfile.json');
const func = require('./functions');
const fs = require("fs");
const db = require('mongodb').MongoClient;
const uri = tokenfile.uri;
const prefix = tokenfile.prefix;
const mongo = new db(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bot = new Discord.Client();

// Read directory /commands/
/*fs.readdir("./commands", (err, files) => {
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
});*/

  func.fetchCommands();

  bot.commands = new Discord.Collection();
  bot.other = new Discord.Collection();

  var version = "1.1";
  // lets you know the bot is online and ready to be used
    bot.on('ready', () => {
      console.log(`${bot.user.username} is online!`);
      bot.user.setActivity(`Alpha 0.275.26 (${prefix})`, {
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
    if(!message.content.startsWith(prefix)) return;
    if(message.guild.id !== "653024881348182016") return message.channel.send("I'm currently being rewritten, my commands are useless here.")
    
    // Command handler
    func.runCommands(message);
    // End command handler
  });



bot.login(tokenfile.token);