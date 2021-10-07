# Ghost Transcript

## Introduction

😊 A easy Transcript Message collector that sends in html format. 

## Installation
```
npm i discord-ghost-transcript-v13
```


[Support Server](https://discord.gg/gTmh5TcEwR)
=======


### Options

With Options, you can customize the title, description, date format, date location and the order of messages

<<<<<<< HEAD
``` javascript
const { fetchTranscript } = require("discord-ghost-transcript-v13");
const { MessageAttachment } = require("discord.js");


//example
module.exports = {
    name: 'transcript',
    description: 'Fetches a html trascript from discord',
    async execute(message){
        fetchTranscript(message, {
             numberOfMessages: 10 , // will fetch how many messages you want  5 to 100 messages to fetch, default is 5
            channel: true, // true in message.channel, false is interaction.channel
            dateFormat: "MM/DD/YYYY at HH:mm:ss", // moment date format, default is 'E, d MMM yyyy HH:mm:ss Z'
            dateLocale: "pt-br", // moment locale, default is "en"
            customTitle: "Transcripted channel", // title, default is your guild name
            customDescription: "I have no idea what i'm doing", // description, default is `Transcripted ${numberOfMessages} messages From: ${channel.name}`
        }).then((data) => {
            const file = new Discord.MessageAttachment(data, "index.html");
            message.channel.send(file);
        });
    }
}
// it will fetch 5 messages in the current channel with custom options.
```
