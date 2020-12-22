// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // message.reply(message.content);

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);
  // log_message = `user: ${message.author.username},\n said: ${message.content},\n in channel: #${message.channel.name}\n`
  // client.logs.set(client.logs.autonum,{ user: message.author.username, message: message.content, channel: message.channel.name })
  // message.guild.channels.cache.find(c => c.name === "command-testing").send(log_message).catch(console.error);

  if (!message.content) {
    message.content = 'None'
  } else {
    message.content = escape(message.content, ['angle brackets'])
    // message.attachments.url = ''

  }

  client.logs.set(client.logs.autonum, [message.id, message.author.id, message.content, message.attachments.url, new Date().toISOString()])

};
