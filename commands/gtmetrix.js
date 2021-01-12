const Discord = require('discord.js');
const tokenfile = require('../tokenfile.json');
const key = tokenfile.metrixkey
const metrix = require('gtmetrix') ({
    email: 'kristoferingimundarson@gmail.com',
    apikey: key
});

module.exports = {
    name: "gtmetrix",
    desc: "Measures a website's performance stat through GTMetrix",
    params: ["url", "timeout"],
    mod: 1,
    execute: async (message, args) => {
        message.channel.send("Not in use.")
    }
}