const axios = require("axios");
const Discord = require('discord.js');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse')

module.exports = {
    name: "lh",
    desc: "Audits a website via Google's lighthouse",
    params: ["url"],
    mod: 1,
    execute: async (message, args) => {
        const chrome = await chromeLauncher.launch({chromeFlags: ['--headless', '--no-sandbox']});
        const flags = {logLevel: 'quiet', output: 'html', port: chrome.port};
        const msg = await message.channel.send("Polling results... please wait");
        await lighthouse(args[0], flags).then(function(runnerResult){
            const perf = runnerResult.lhr.categories.performance;
            const bestpractise = runnerResult.lhr.categories['best-practices'];
            const access = runnerResult.lhr.categories.accessibility;
            const seo = runnerResult.lhr.categories.seo;
            const res = new Discord.MessageEmbed()
            .setAuthor("Lighthouse Audit", "https://i.imgur.com/dne8zH2.png")
            .setThumbnail("https://i.imgur.com/dne8zH2.png", {dynamic:true})
            .setColor("RANDOM")
            .setDescription(`Lighthouse Audit for ${args[0]}`)
            .addFields(
                { name:"Performance", value: `${perf.score * 100}`, inline: false},
                { name:"Best practises", value: `${bestpractise.score * 100}`, inline: false},
                { name:"Accessibility", value: `${access.score * 100}`, inline: false},
                { name:"SEO", value: `${seo.score * 100}`, inline: false}
            )
            .setFooter("Audit by Google Lighthouse", "https://i.imgur.com/dne8zH2.png")
            .setTimestamp()
            msg.delete()
            message.channel.send(res)
            //console.log(runnerResult.lhr);
        });
    }
}