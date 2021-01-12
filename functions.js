const Discord = require('discord.js');
const conf = require('./bconf.json');
const prefix = conf.prefix;
const fs = require('fs');
const bot = new Discord.Client();

exports.fetchCommands = function () {

    bot.commands = new Discord.Collection();
    bot.other = new Discord.Collection();

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
}

exports.runCommands = function(message) {

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let cmd = args.shift().toLowerCase();
    if (!cmd.length) return;
    let command = bot.commands.get(cmd);
    // Start command handler 
    try {
      console.log(command)
      if(command.mod && !message.member.hasPermission("KICK_MEMBERS")) throw("You don't have the perms to use this command");
      command.execute(message, args);
      console.log(command)
    } catch (e) {
      const error = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor("Error 🛑")
      .setDescription(`Error running ${command.name}: `)
      .addFields({name: "Error message:", value: e, inline: false}, {name:"Required parameters:", value: command.params, inline: false })

      message.channel.send(error)
    }
}

exports.edited = async (oldMessage,newMessage) => {
    if(oldMessage.author.bot) return;
    let logChannel = oldMessage.guild.channels.cache.find(c => c.name === "message-logs")

    const embed = new Discord.MessageEmbed()
    .setTitle("Message edited")
    .setColor("RANDOM")
    .setDescription(`[Jump to message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
    .addFields(
        {name: `From`, value: `${oldMessage.content}`, inline: true},
        {name: `To`, value: `${newMessage.content}`, inline: true},
        {name: `User`, value:`**${oldMessage.author.tag}** (ID: **${oldMessage.author.id}**)`}
    )
    .setFooter(`Message ID: ${oldMessage.id}`)
    
    //console.log(logChannel)

    logChannel.send(embed)
}

exports.deleted = async (message) => {
    if(message.author.bot) return;
    let logChannel = message.guild.channels.cache.find(c => c.name === "message-logs")
    //console.log(message)

    const embed = new Discord.MessageEmbed()
    .setTitle("Message deleted")
    .setColor("RANDOM")
    .setDescription(`Message deleted from <#${message.channel.id}>`)
    .addFields(
        {name: "Contents:", value: `${message.content}`, inline: false},
        {name: "User:", value: `${message.author.tag} (ID: **${message.author.id}**)`, inline: false}
        )
    .setFooter(`Message ID: ${message.id}`)
    logChannel.send(embed);
}