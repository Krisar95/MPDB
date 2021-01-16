const { Client, MessageEmbed, Collection } = require('discord.js');
require('dotenv').config()
const fs = require('fs');
const token = process.env.TOKEN;
const bot = new Client();
const Guild = require('./models/guild');




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
      console.log(`${props.name} loaded successfully. ✅`);
      bot.commands.set(props.name, props)
      bot.other.set(props.alias, props)
      });
  });

  fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
    if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`); // Here we require the event file of the events folder
        if (eventFunction.disabled) return; // Check if the eventFunction is disabled. If yes return without any error

        const event = eventFunction.event || file.split('.')[0]; // Get the exact name of the event from the eventFunction variable. If it's not given, the code just uses the name of the file as name of the event
        const emitter = (typeof eventFunction.emitter === 'string' ? bot[eventFunction.emitter] : eventFunction.emitter) || bot; // Here we define our emitter. This is in our case the bot (the bot)
        const once = eventFunction.once; // A simple variable which returns if the event should run once

        // Try catch block to throw an error if the code in try{} doesn't work
        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args)); // Run the event using the above defined emitter (bot)
        } catch (error) {
            console.error(error.stack); // If there is an error, console log the error stack message
        }
    });
  });

  bot.on("ready", async () => {
      console.log(`${bot.user.username} is online in ${bot.guilds.cache.size} servers!`);
      let array = bot.guilds.cache
      array.forEach(guild => {
        console.log(guild.name);
      });
      bot.user.setActivity(`Alpha 0.275.65`, {
          type: "PLAYING"
        }
      );
  })

  bot.servers = new Map();
  bot.afk = new Map();
  bot.commands = new Collection();
  bot.other = new Collection();
  bot.mongoose = require('./utils/mongoose');

  bot.on("message", async (message) => {

      if(message.author.bot) return;
      if(!message.guild) return;

      const Guild = require('./models/guild');
      const doc = await Guild.findOne({gid: `${message.guild.id}`})
      
      // on first admin message, create a message-logs channel under "bot logs" category if a message-logs channel doesn't already exist
      // and then sends the admin a DM with instructions on how to change channel perms for appropriate users/roles.
      let channel = message.guild.channels.cache.find(channel => channel.name === "message-logs" );
      
      if(!channel && message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
        let guild = message.guild
        let botrole = message.guild.roles.cache.find(r => r.name === "MPDB")
        let category = message.guild.channels.cache.find(c => c.name === "Bot logs")

        if(!category) {
        await message.guild.channels.create("Bot logs", { type: 'category', permissionOverwrites: [{id: guild.id, deny: [ 'VIEW_CHANNEL' ]}, {id: message.author.id, allow: [ "VIEW_CHANNEL" ]}, {id: botrole.id, allow: [ 'VIEW_CHANNEL' ]} ]} )
        .then( category => message.guild.channels.create("message-logs", {
          type: 'text',
          parent: category.id
        }));
        
        message.author.send("As I didn't find a message logs channel, I created one under the `Bot logs` category. Remember to set the correct permissions! \n\nHere's how you do that: \nhttps://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-")
        } else {
          await message.guild.channels.create("message-logs", {
            type: 'text',
            parent: category.id,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: ['VIEW_CHANNEL']
              },
              {
                id: botrole.id,
                allow: ['VIEW_CHANNEL']
              }
            ]
          })
          .then( () => {
            message.author.send("As I didn't find a message logs channel, I created one under the `Bot logs` category. Remember to set the correct permissions! \n\nHere's how you do that: \nhttps://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-")
          })
        }
      }
      
      if(!message.content.startsWith(doc.defaultPrefix)) return;
      //if(message.guild.id !== "653024881348182016") return message.channel.send("I'm currently being rewritten, my commands are useless here.")
      
      let args = message.content.slice(doc.defaultPrefix.length).trim().split(/ +/);
      let cmd = args.shift().toLowerCase();
      if (!cmd.length) return;
      let command = bot.commands.get(cmd);
      // Start command handler 
      try {
        if(command.mod && !message.member.hasPermission("KICK_MEMBERS")) throw("You don't have the perms to use this command");
        command.execute(bot, message, args);
      } catch (e) {
        const error = new MessageEmbed()
        .setColor("RED")
        .setAuthor("Error 🛑")
        .setDescription(`Error running ${command.name}: `)
        .addFields({name: "Error message:", value: e, inline: false}, {name:"Required parameters:", value: command.params, inline: false })
      
        message.channel.send(error)
      }
      // End command handler
  })

bot.mongoose.init();
bot.login(token);