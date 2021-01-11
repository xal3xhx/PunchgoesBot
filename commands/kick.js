exports.run = async (client, message, [target, ...reason], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  if(!target) return message.reply("you must provide a user or id.") // makes sure you gave a target
  user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => console.log('Error'))
  if(!user) message.reply("Couldn't find a user with that ID!"); // confirms the user was found
  user = user.user
  if(user === message.author) return message.channel.send("you cant kick yourself.");
  if(reason == "") reason = "No reason given."
	
	//Check if user is here.
	if(!user) {
		try {
			//Check if its instead a valid ID
			if(!Message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error("Couldn't get a Discord user with this userID!");
			user = message.guild.members.get(args.slice(0, 1).join(' '));
			user = user.user;
		} catch(err) {
			return message.channel.send("Couldn't find a user with that ID!");
		}
	}
	if(user === message.author) return message.channel.send("Don't kick yourself nerd");
	if(!reason) reason = "No reason given."//return message.channel.send("Please provide a reason with this punishment!");
	if(!message.guild.member(user).kickable) return message.channel.send("Cannot kick this user!");
	
	await message.guild.member(user).kick();

	let by = `${message.author.username}#${message.author.discriminator}`
	let username = `${user.username}#${user.discriminator}`
	await client.moderation("kick", by, username, user.id, reason, message, settings);
	
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Twitch Mod"
};

exports.help = {
  name: "kick",
  category: "moderation",
  description: "kicks a given user",
  usage: "kick {user} [reason]"
};
  
  
  
  /*if(!target) return message.channel.send("Please provide a valid mention or ID.");
  
  let user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(()=>{console.log("error")}) || null;
  let reason = res.join(" ")
  
  if(!user) return message.channel.send("Please provide a valid mention or ID.");
  if(!user.bannable) return message.channel.send("I cannot ban this user.");
  if (!reason) reason = "No reason given.";
  
  message.channel.send("ban")*/