# Ghost Transcript

## Introduction

😊 A easy Transcript Message collector that sends in html format. 


## Installation
```
npm i discord-ghost-transcript-v13
```


## Support Server
```

[GhostCodes JS Support](https://discord.gg/gTmh5TcEwR)

```

## Code Samples

``` javascript
 // destructure the package
const { fetchTranscript } = require("discord-ghost-transcript-v13");
// add this package as well
const Discord = require('discord.js')

// here is how you use it

// template
// fetchTranscript(message: any, numberOfMessages: number, sendToAuthor: boolean)

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
