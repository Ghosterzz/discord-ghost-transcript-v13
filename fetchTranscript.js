async function fetchTranscript(channel ,message, numberOfMessages) {
    if(!message) throw new ReferenceError('GhostTranscript => "message" is not defined')
      if(!numberOfMessages) throw new ReferenceError('GhostTranscript => "numberOfMessages" is not defined')
      if(typeof numberOfMessages !== "number") throw new SyntaxError('GhostTranscript => typeof "numberOfMessages" must be a number')
      if(numberOfMessages >= 100) throw new RangeError('GhostTranscript => "numberOfMessages" must be under 100 messages')
      const jsdom = require('jsdom');
      const fs = require('fs')
      const Discord = require('discord.js')
      const { JSDOM } = jsdom;
      const dom = new JSDOM();
      const document = dom.window.document;
      let messageCollection = new Discord.Collection();
      let channelMessages = await channel.messages.fetch({
          limit: numberOfMessages
      }).catch(err => console.log(err));
      messageCollection = messageCollection.concat(channelMessages);
  
      while(channelMessages.size === 100) {
          let lastMessageId = channelMessages.lastKey();
          channelMessages = await channel.messages.fetch({ limit: numberOfMessages, before: lastMessageId }).catch(err => console.log(err));
          if(channelMessages)
              messageCollection = messageCollection.concat(channelMessages);
      }
      let msgs = messageCollection.array().reverse();
      return new Promise(async(ful) => {
          await fs.readFile(require('path').join(__dirname, 'template.html'), 'utf8', async function(err, data) {
              if(data) {
                  await fs.writeFile(require('path').join(__dirname, 'index.html'), data, async function(err) {                if(err) return console.log(err) 
                      let info = document.createElement('div')
                      info.className =  'info';
                      let iconClass = document.createElement('div')
                      iconClass.className = 'info__guild-icon-container';
                      let guild__icon = document.createElement('img')
                      guild__icon.className = 'info__guild-icon'
                      guild__icon.setAttribute('src', message.guild.iconURL())
                      iconClass.appendChild(guild__icon)
                      info.appendChild(iconClass)
                      
                      let info__metadata = document.createElement('div')
                      info__metadata.className = 'info__metadata'
      
                      let guildName = document.createElement('div')
                      guildName.className = 'info__guild-name'
                      let gName = document.createTextNode(message.guild.name);
                      guildName.appendChild(gName)
                      info__metadata.appendChild(guildName)
                      let messagecount = document.createElement('div')
                      messagecount.className = 'info__channel-message-count'
                      messagecount.appendChild(document.createTextNode(`Transcripted ${numberOfMessages} messages From: ${channel.name}`))
                      info__metadata.appendChild(messagecount)
                      info.appendChild(info__metadata)
                      await fs.appendFile(require('path').join(__dirname, 'index.html'), info.outerHTML, async function(err) {
                          if(err) return console.log(err)
                          msgs.forEach(async msg => {
                              let parentContainer = document.createElement("div");
                              parentContainer.className = "parent-container";
                              let avatarDiv = document.createElement("div");
                              avatarDiv.className = "avatar-container";
                              let img = document.createElement('img');
                              img.setAttribute('src', msg.author.displayAvatarURL());
                              img.className = "avatar";
                              avatarDiv.appendChild(img);
              
                              parentContainer.appendChild(avatarDiv);
                              let messageContainer = document.createElement('div');
                              messageContainer.className = "message-container";
                              let nameElement = document.createElement("span");
                              let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
                              nameElement.appendChild(name);
                              messageContainer.append(nameElement);
              
                              if(msg.content.startsWith("```")) {
                                  let m = msg.content.replace(/```/g, "");
                                  let codeNode = document.createElement("code");
                                  let textNode =  document.createTextNode(m);
                                  codeNode.appendChild(textNode);
                                  messageContainer.appendChild(codeNode);
                              }
                              else {
                                  let msgNode = document.createElement('span');
                                  if (msg.attachments){
                                    
                                    const files = getImageLinks(msg.attachments);
                                    if (files[0] !== undefined){
                                        let img = document.createElement('img');
                                        img.setAttribute('src', files[0])
                                        messageContainer.appendChild(img)
                                    }
                                    console.log(files[0])
                                  } 
                                  
                                  if (msg.content){
                                  let textNode = document.createTextNode(msg.content);
                                  msgNode.append(textNode);
                                  messageContainer.appendChild(msgNode);
                                  }

                                  
                              }
                              parentContainer.appendChild(messageContainer);
                              await fs.appendFile(require('path').join(__dirname, 'index.html'), parentContainer.outerHTML, function(err) {
                                  if(err) return console.log(err)
                              })
                          });
                          fs.readFile(require('path').join(__dirname, 'index.html'), (err, data) => {
                              if(err) console.log(err)
                              ful(data)
                          })    
                      })
                  })
              }
          })
      })
  }
  
  module.exports = fetchTranscript;
  function getImageLinks(attachments) {
  const valid = /^.*(gif|png|jpg|jpeg)$/g;
  return attachments.array().filter((attachment) => valid.test(attachment.url)).map((attachment) => attachment.url);
}