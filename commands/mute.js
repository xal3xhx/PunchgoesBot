exports.run = async (client, message, [target, ...res], level) => { // eslint-disable-line no-unused-vars
  if (message.author.bot) return; // ignore bots
  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  const args = message.content.split(' ').slice(1);
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
	if(user === message.author) return message.channel.send("Don't mute yourself nerd");
	if(!reason) reason = "No reason given."
	const mutedRole = message.guild.roles.cache.find(c => c.name === "Muted")
	console.log(settings)
	
	message.guild.members.cache.get(user.id).roles.add(mutedRole);
	let by = `${message.author.username}#${message.author.discriminator}`
	let formated = `${user.username}#${user.discriminator} (${user.id})`
	await client.moderation("mute", by, formated, reason, message, settings);
	
};
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Discord Mod"
};

exports.help = {
  name: "mute",
  category: "management",
  description: "mute",
  usage: "mute"
};