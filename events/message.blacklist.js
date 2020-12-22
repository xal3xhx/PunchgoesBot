module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);


  const blacklist = String(settings.blacklist).split(",")
  // client.logger.log(blacklist.some(word => message.content.toLowerCase().includes(word)))

  if (String(blacklist)) {
    if (!message.content.includes("~blacklist remove")) {
      if (blacklist.some(word => message.content.toLowerCase().includes(word))) {
        message.delete()
        message.reply("You cant say that here, you have been warned!")
      }
    }
  }
};
