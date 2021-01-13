const Discord = require('discord.js');
const bot = new Discord.Client();
const func = require('../functions');

module.exports = {
    event: "messageUpdate",
    once: "false",
    run(oldMessage, newMessage) {
        func.edited(oldMessage,newMessage);      
    }
}