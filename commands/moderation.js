const Discord = require('discord.js');

exports.run = async (client, message, [action, ...value], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  if(!action) return message.reply("please specify an action or a username/id.")
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  const args = message.content.split(' ').slice(1);

  let embeds = []
  let actionformated = ""
  additional = ""

  async function switchcasesingle(value,key) {
    switch(value.action) {
        case "ban": {
          actionformated = "banned by:"
          value.actionformated = actionformated
          value.casenum = key
          embeds.push(value)
          break
        }
        case "kick": {
          actionformated = "kicked by:"
          value.actionformated = actionformated
          value.casenum = key
          embeds.push(value)
          break
        }
        case "warn": {
          actionformated = "warned by:"
          value.actionformated = actionformated
          value.casenum = key
          embeds.push(value)
          break
        }
        case "mute": {
          actionformated = "muted by:"
          value.actionformated = actionformated
          value.casenum = key
          embeds.push(value)
          break
        }
        case "tempban": {
          actionformated = "tempbanned by:"
          value.actionformated = actionformated
          value.casenum = key
          additional = `**unban at**: ${pardon} \n **pardoned**: ${pardoned}`
          embeds.push(value)
          break
        }
        case "tempmute": {
          actionformated = "tempmuted by:"
          value.actionformated = actionformated
          value.casenum = key
          additional = `**unmute at**: ${pardon} \n **pardoned**: ${pardoned}`
          embeds.push(value)
          break
        }
      }
    return embeds // formats the case as pulled from the database. adds the additional feilds and the title
  }

  async function switchcasemulti(content) {
    for (const [key, value] of Object.entries(content)) {
      switch(value.action) {
          case "ban": {
            actionformated = "banned by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            embeds.push(value)
            break
          }
          case "kick": {
            actionformated = "kicked by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            embeds.push(value)
            break
          }
          case "warn": {
            actionformated = "warned by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            embeds.push(value)
            break
          }
          case "mute": {
            actionformated = "muted by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            embeds.push(value)
            break
          }
          case "tempban": {
            actionformated = "tempbanned by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            additional = `**unban at**: ${pardon} \n **pardoned**: ${pardoned}`
            embeds.push(value)
            break
          }
          case "tempmute": {
            actionformated = "tempmuted by:"
            value.actionformated = actionformated
            if(!value.casenum) value.casenum = key
            additional = `**unmute at**: ${pardon} \n **pardoned**: ${pardoned}`
            embeds.push(value)
            break
          }
        }
      }
    return embeds // formats the case as pulled from the database. adds the additional feilds and the title
  }

  async function formatcase(content,key) {
    if(content.action){
      return await switchcasesingle(content,key)
    }
    else {
      return await switchcasemulti(content)
    }  
  };

  async function sendembed(title, content) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(title)
      .setColor("RED")
    for (var i in content) {
      i = content[i]
      embed.addField(`${i.actionformated} ${i.by}`, `
        **Case Number**: ${i.casenum}
        **Action**: ${i.action}
        **User**: ${i.username} (${i.userid})
        **Reason**: ${i.reason}
        ${additional}
        `)
    }
    await message.guild.channels.cache.find(c => c.name === settings.modLogChannel).send(``,{embed},{split: true}).catch(console.error); // lists the 10 most recent cases
  }

  if(action == "list") {
    const count = client.modcase.count
    const everything = await client.modcase.fetchEverything().array() // i really dont want to do this...
    last10 = everything.slice(Math.max(everything.length - 10, 1))
    for(const i in last10) {
      last10[i].casenum = await client.modcase.findKey("messageid", last10[i].messageid)
    }
    let formated = await formatcase(last10)
    await sendembed(`showing the last 10 cases`, formated)
  };

  if(action == "case") {
    if(value == "") return message.reply("please specify a case number to view.")
    let currrentcase = await client.modcase.get(value) // pulls the case using the case number provided
    if(!currrentcase) return message.reply("could not find a case with that number") // checks if a case was found
    i = await formatcase(currrentcase, value) // returns the formated embed information, passed the value to keep the casenumber
    await sendembed(`showing case number ${value}`, i) // sends the formated embed
  };

  if(action == "edit") { // allows you to edit a case
    if(value == "") return message.reply("please specify a case number to edit.")
    let currrentcase = await client.modcase.get(value) // pulls the case using the case number provided
    if(!currrentcase) return message.reply("could not find a case with that number") // checks if a case was found
    // i = await formatcase(currrentcase, value) // returns the formated embed information
    // await sendembed(`showing case number ${value}`, i) // sends the formated embed
    change = await client.awaitReply(message, "what would you like to change the reason to?")
    updated = await client.modcase.update(value, {"reason": change} ) // updates the database with the new reason
    await client.modcase.set(String(value), updated)

    modchannel = await message.guild.channels.cache.find(c => c.name === settings.modLogChannel)
    oldmessage = await modchannel.messages.fetch(currrentcase.messageid)

    description = String(oldmessage.embeds[0].description)
    author = oldmessage.embeds[0].author.name
    const regex = /\*\*Reason\*\*:.*/i;
    description = description.replace(regex, `Reason: ${change}`)
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${author}`)
      .setColor("RED")
      .setDescription(`${description}`)
      .setTimestamp()

    oldmessage.edit(embed)

    await message.reply("reason has been changed.")
  };

  if(action == "view") { // shows all the cases for a specific user/id
    if(value == "") return message.reply("please specify a user.")
    let username = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(`${value}`).catch(() => console.log('Error'))
    if(!username) return message.reply("count not find anyone with that username/id.")
    let currrentcase = await client.modcase.findAll('userid', username.id); // pulls the cases for the given username
    for(const i in currrentcase) {
      currrentcase[i].casenum = await client.modcase.findKey("messageid", currrentcase[i].messageid)
    }
    formated = await formatcase(currrentcase) // returns the formated embed information, passed the value to keep the casenumber
    await sendembed(`showing cases for: ${username.user.username}#${username.user.discriminator}`, formated)
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Admin"
};

exports.help = {
  name: "moderation",
  category: "moderation",
  description: "allows you to view the moderation logs. list will show the last 10 moderation events. case will show the case for a given number. edit will allow you to edit the reason for a given casenumber. view will allow you to view all moderation events for a given user.",
  usage: "moderation {list | case | edit | view}"
};
