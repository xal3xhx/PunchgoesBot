const Discord = require('discord.js');

exports.run = async (client, message, [action, ...value], level) => { // eslint-disable-line no-unused-vars
if (message.author.bot) return; // ignore bots
if(!action) return message.reply("please specify an action or a username/id.")
const settings = message.settings = client.getSettings(message.guild); // pulls settings
const args = message.content.split(' ').slice(1);

let embeds = []
let actionformated = ""
additional = ""

function map_to_object(map) {
    let out = {}
    map.forEach((value, key) => {
      out += value
    })
    return out
  }

async function formatcase(content,key) {
  for (var i in content) {
    value = content[i]
    console.log(value.action)
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
    }
  return embeds // formats the case as pulled from the database. adds the additional feilds and the title
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
      **User**: ${i.user}
      **Reason**: ${i.reason}
      ${additional}
      `)
  }
  await message.guild.channels.cache.find(c => c.name === settings.modLogChannel).send(``,{embed},{split: true}).catch(console.error); // lists the 10 most recent cases
}

if(action == "list") {
  const count = Number(client.modcase.count)
  const last10 = await Object.fromEntries(client.modcase.fetch(Array(Math.ceil((count - (count-11)) / 1)).fill(count-10).map((x, y) => x + y * 1)))
  let i = await formatcase(last10)
  // console.log(last10)
  // console.log(i)
  await sendembed(`showing the last 10 cases`, i)
  }

if(action == "case") {
  if(value == "") return message.reply("please specify a case number to edit.")
  let currrentcase = await client.modcase.get(value) // pulls the case using the case number provided
  if(!currrentcase) return message.reply("could not find a case with that number") // checks if a case was found
  i = await formatcase(currrentcase, value) // returns the formated embed information, passed the value to keep the casenumber
  // console.log(currrentcase)
  // console.log(i)
  await sendembed(`showing case number ${value}`, i) // sends the formated embed
};

if(action == "edit") { // allows you to edit a case

};

if(action == "view") { // shows all the cases for a specific user/id

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
  description: "allows you to view the moderation logs.",
  usage: "moderation"
};
