const Discord = require("discord.js"); //requiered to load again to make the embed work
const imgur = require('imgur');

async function uploadImgur(url) {
	let json = await imgur.uploadUrl(url)
    let imgurURL = String(json.data.link)
    return imgurURL
}

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  if (message.attachments.first()) {
  	const imgurURL = await uploadImgur(message.attachments.first().proxyURL)
    var embed = new Discord.MessageEmbed()
	    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	    .addField(`Message Deleted`, `► Content: \`${imgurURL}\`\n► Channel: **${message.channel.name}**\n► Message ID: ${message.id}`)
	    .setTimestamp()
	    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)
	
  }
  else {
    var embed = new Discord.MessageEmbed()
	    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	    .addField(`Message Deleted`, `► Content: \`${message.cleanContent}\`\n► Channel: **${message.channel.name}**\n► Message ID: ${message.id}`)
	    .setTimestamp()
	    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)
  }
  await message.guild.channels.cache.find(c => c.name === modLogChannel).send(``,{embed}).catch(console.error);
  // A message created by **${message.author.username}#${message.author.discriminator}** was just deleted in ${message.channel}
};
