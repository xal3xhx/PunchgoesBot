exports.run = async (client, message, [target, ...res], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  const args = message.content.split(' ').slice(1);
  //let user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => console.log('Error')) || null;
  const user = message.mentions.users.first();
  const reason = args.slice(1).join(' ');
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
	if(user === message.author) return message.channel.send("Don't warn yourself nerd");
	if(!reason) reason = "No reason given."//return message.channel.send("Please provide a reason with this punishment!");
	//if(!message.guild.member(user).roles.cache.has(role => role.name === "Admin")) return message.channel.send("Cannot warn this user!"); 

	let by = `${message.author.username}#${message.author.discriminator}`
	let formated = `${user.username}#${user.discriminator} (${user.id})`
	await client.moderation("warn", by, formated, reason, message, settings);
	
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Discord Mod"
};

exports.help = {
  name: "warn",
  category: "management",
  description: "warn",
  usage: "warn"
};