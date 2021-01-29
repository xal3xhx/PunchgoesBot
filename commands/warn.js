exports.run = async (client, message, [target, ...reason], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  if(!target) return message.reply("you must provide a user or id.") // makes sure you gave a target
  user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => console.log('Error'))
  if(!user) message.reply("Couldn't find a user with that ID!"); // confirms the user was found
  user = user.user
  if(user === message.author) return message.channel.send("you cant warn yourself");
  if(reason == "") reason = "No reason given."

  let by = `${message.author.username}#${message.author.discriminator}`
  let username = `${user.username}#${user.discriminator}`
  await client.moderation("warn", by, username, user.id, reason, message, settings);
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Trial Mod"
};

exports.help = {
  name: "warn",
  category: "moderation",
  description: "warns the user",
  usage: "warn {user} [reason]"
};