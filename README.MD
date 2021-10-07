# Ghost Transcript

## Introduction

😊 A easy Transcript Message collector that sends in html format. 


## Installation
```
npm i discord-ghost-transcript-v13
```


## Support Server

[GhostCodes JS Support](https://discord.gg/gTmh5TcEwR)

## Code Samples

``` javascript
 // destructure the package
const { fetchTranscript } = require("discord-ghost-transcript-v13");
// add this package as well
const Discord = require('discord.js')

// here is how you use it

// template
// fetchTranscript(message: any, numberOfMessages: number, sendToAuthor: boolean)

// returns buffer

//example

module.exports = {
    name: 'transcript',
    description: 'Fetches a html trascript from discord',
    async execute(message){
        const channel = message.channel
        fetchTranscript(channel, message, 5).then((data) => {
            const file = new Discord.MessageAttachment(data, "index.html");
            message.channel.send(file);
        });
    }
}
// it will fetch 5 messages in the current channel. 
```

### Options

With Options, you can customize the title, description, date format, date location and the order of messages

``` javascript

// destructure the package
const { fetchTranscript } = require("discord-ghost-transcript-v13");
// add this package as well
const Discord = require('discord.js')

// here is how you use it

// template
// fetchTranscript(message: any, numberOfMessages: number, sendToAuthor: boolean)

// returns buffer

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