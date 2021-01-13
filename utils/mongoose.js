const mongoose = require('mongoose');
require('dotenv').config()

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser     : true,
            useUnifiedTopology  : true,
            autoindex           : false,
            //reconnectTries      : Number.MAX_VALUE,
            //reconnectInterval   : 500,
            poolSize            : 5,
            connectTimeoutMS    : 10000,
            family              : 4
        };

        mongoose.connect(process.env.URI, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => { 
            console.log('Mongoose has connected successfully!');
        });
        mongoose.connection.on("err", (err) => {
            console.error("ERROR: \n " + err.stack);
        });
        mongoose.connection.on("disconnected", () => {
            console.warn("Mongoose connection lost");
        })
    }
}