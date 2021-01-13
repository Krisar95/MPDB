const mongoose = require("mongoose");
const Guild = require("../models/guild");

module.exports = {
    event: "guildCreate",
    once: false,
    run: async (guild) => {
        guild = new Guild({
            _id: mongoose.Types.ObjectId(),
            gid: guild.id,
            gname: guild.name,
            defaultPrefix: "$"
        });
    
        guild.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));
    
        console.log("I just joined a new server!")
    
    }
}



