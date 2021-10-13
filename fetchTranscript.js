
async function fetchTranscript(message, options) {
    if(!message) throw new ReferenceError('GhostTranscript => "message" is not defined')
      if(!options.numberOfMessages) throw new ReferenceError('GhostTranscript => "numberOfMessages" is not defined')
      if(typeof options.numberOfMessages !== "number") throw new SyntaxError('GhostTranscript => typeof "numberOfMessages" must be a number')
      if(options.numberOfMessages >= 100) throw new RangeError('GhostTranscript => "numberOfMessages" must be under 100 messages')
      if(typeof options !== "object") throw new SyntaxError('GhostTranscript => typeof "options" must be a object')
      const jsdom = require('jsdom');
      const fs = require('fs')
      const Discord = require('discord.js')
      const { JSDOM } = jsdom;
      const dom = new JSDOM();
      const document = dom.window.document;
      const moment = require('moment');
      //const reverseArray = require('reverse-array');
      const Options = {
          numberOfMessages: options.numberOfMessages || '6',
          channel: options.channel || interaction.channel ,
          //inverseArray: options.inverseArray || false,
          dateFormat: options.dateFormat || 'E, d MMM yyyy HH:mm:ss Z',
          dateLocale: options.dateLocale || 'en',
          customTitle: options.customTitle || '',
          customDescription: options.customDescription || `Transcripted ${numberOfMessages} messages From: ${channel.name}`,
          guild__icon: options.guild__icon
      }

      moment.locale(Options.dateLocale);
      let messageCollection = new Discord.Collection();
      let channelMessages = await message.channel.messages.fetch({
          limit: options.numberOfMessages
      }).catch(err => console.log(err));
      messageCollection = messageCollection.concat(channelMessages);
  
      while(channelMessages.size === 100) {
          let lastMessageId = channelMessages.lastKey();
          channelMessages = await message.channel.messages.fetch({ limit: options.numberOfMessages, before: lastMessageId }).catch(err => console.log(err));
          if(channelMessages)
              messageCollection = messageCollection.concat(channelMessages);
      }
      
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
                    
                      if (options.guild__icon) {
                        guild__icon.setAttribute('src', options.guild__icon )
                      } else {
                        guild__icon.setAttribute('src', 'https://cdn.discordapp.com/attachments/878008751855112192/895637636671229953/icon_clyde_blurple_RGB.png')
                      }
                      iconClass.appendChild(guild__icon)
                      info.appendChild(iconClass)
                      
                      let info__metadata = document.createElement('div')
                      info__metadata.className = 'info__metadata'
      
                      let guildName = document.createElement('div')
                      guildName.className = 'info__guild-name'
                      let gName = document.createTextNode(Options.customTitle);
                      guildName.appendChild(gName)
                      info__metadata.appendChild(guildName)
                      let messagecount = document.createElement('div')
                      messagecount.className = 'info__channel-message-count'
                      messagecount.appendChild(document.createTextNode(Options.customDescription))
                      info__metadata.appendChild(messagecount)
                      info.appendChild(info__metadata)
                      await fs.appendFile(require('path').join(__dirname, 'index.html'), info.outerHTML, async function(err) {
                          if(err) return console.log(err)

                          //if (options.inverseArray) messageCollection = messageCollectio
                         // Object.entries({messageCollection})
                          
 


                          messageCollection.forEach(async msg => {
                              let parentContainer = document.createElement("div");
                              parentContainer.className = "parent-container";
                              let avatarDiv = document.createElement("div");
                              avatarDiv.className = "avatar-container";
                              let img = document.createElement('img');
                              img.setAttribute('src', msg.author.displayAvatarURL({dynamic: true}));
                              img.className = "avatar";
                              avatarDiv.appendChild(img);
              
                              parentContainer.appendChild(avatarDiv);
                              let messageContainer = document.createElement('div');
                              messageContainer.className = "message-container";
                              let nameElement = document.createElement("span");
                              let name = document.createTextNode(msg.author.tag + " ・ " + moment(msg.createdAt).format(Options.dateFormat));
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
                                    if (files[0] !== undefined ){
                                        let img = document.createElement('img');
                                        console.log(files[0])
                                        img.setAttribute('src', files[0])
                                        messageContainer.appendChild(img)
                                    }
                                    console.log({files: files})
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
  return attachments.filter((attachment) => valid.test(attachment.url)).map((attachment) => attachment.url);
}
