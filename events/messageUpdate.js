// runs everytime a message gets edited.

//needs to load again to make the embed work
const Discord = require("discord.js");


module.exports = async (client, message, newMessage) => {
  if (message.author.bot) return; // ignore bots
  if (newMessage.attachments.first()) return; // ignores attachments

  const settings = message.settings = client.getSettings(message.guild); // pulls settings
  if (message.guild && !message.member) await message.guild.members.fetch(message.author); // fetch invisible users
  
  var embed = new Discord.MessageEmbed()
	    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	    .addField(`Message Updated`, `► OldMessage: \`${message.cleanContent}\`\n► NewMessage: \`${newMessage.cleanContent}\`\n► Channel: **${message.channel.name}**\n► Message ID: ${message.id}`)
	    .setTimestamp()
	    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)
  
  message.guild.channels.cache.find(c => c.name === settings.modLogChannel).send(``,{embed}).catch(console.error);
};
