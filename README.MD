# Ghost Transcript

## Introduction

😊 A easy Transcript Message collector that sends in html format. 

## Code Samples

``` javascript
 // destructure the package
const fetchTranscript = require("discord-ghost-transcript");

// here is how you use it

// template
// fetchTranscript(message: any, numberOfMessages: number, sendToAuthor: boolean)

// returns buffer

//example
module.exports = {
    name: "transcript",
    run: async (client, message) => {
        fetchTranscript(channel, message, 5).then((data) => {
            const file = new MessageAttachment(data, "index.html");
            message.channel.send(file);
        });
    },
};
// it will fetch 5 messages in the current channel. 
```

## Installation

> npm i discord-ghost-transcript 