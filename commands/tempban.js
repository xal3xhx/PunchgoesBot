const Discord = require('discord.js');

exports.run = async (client, message, [target, time, ...reason], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  
  if(!target) return message.reply("please specify an action or a username/id.")
  if(!time) time = "1D" // sets the default time to 1 day
  if(reason == "") reason = "no reason given." // sets the default reason
  user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => console.log('Error'))
  if(!user) message.reply("Couldn't find a user with that ID!"); // confirms the user was found

  time = time.toUpperCase()

  switch (true) {
    case time.includes("T"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 100 * i
      break;
    case time.includes("H"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 3.6e6 * i
      break;
    case time.includes("D"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 8.64e7 * i
      break;
    case time.includes("W"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 6.048e8 * i
      break;
    case time.includes("M"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 2.628e9 * i
      break;
    case time.includes("Y"):
      i = time.match(/(?:\d*\.)?\d+/g, '');
      value = 3.154e10 * i
      break;
  }

  if (level <= 3 && value >= 86500000) return message.reply("You can only tempban for 1DAY or less.")

  unbanAt = new Date((new Date()).valueOf() + value)
  by = `${message.author.username}#${message.author.discriminator}`
  username = `${user.user.username}#${user.user.discriminator}`
  await client.moderation("tempban", by, username, user.id, reason, message, settings, unbanAt);
  // await message.guild.member(user).ban();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Twitch Mod"
};

exports.help = {
  name: "tempban",
  category: "moderation",
  description: "temporary bans the user, time can be given in the 1D 1W 1Y etc format (1day 1week 1year)",
  usage: "tempban {user} [time] [reason]"
};
