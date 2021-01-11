exports.run = async (client, message, [target, ...reason], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  if(!target) return message.reply("you must provide a user or id.") // makes sure you gave a target
  user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => console.log('Error'))
  if(!user) message.reply("Couldn't find a user with that ID!"); // confirms the user was found
  user = user.user
  if(user === message.author) return message.channel.send("you cant ban yourself.");
  if(reason == "") reason = "No reason given."

  if(!message.guild.member(user).bannable) return message.channel.send("Cannot ban this user!");
	
  await message.guild.member(user).ban();

  let by = `${message.author.username}#${message.author.discriminator}`
  let username = `${user.username}#${user.discriminator}`
  await client.moderation("ban", by, username, user.id, reason, message, settings);

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "Administrator"
};

exports.help = {
	name: "ban",
	category: "moderation",
	description: "ban a given user.",
	usage: "ban {user} [reason]"
};



/*if(!target) return message.channel.send("Please provide a valid mention or ID.");

let user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(()=>{console.log("error")}) || null;
let reason = res.join(" ")

if(!user) return message.channel.send("Please provide a valid mention or ID.");
if(!user.bannable) return message.channel.send("I cannot ban this user.");
if (!reason) reason = "No reason given.";

message.channel.send("ban")*/