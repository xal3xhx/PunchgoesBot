module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // reads the blacklist into an array.
  const blacklist = String(settings.blacklist).split(",")

  // makes sure the blacklist contains something, prevents every message from being removed
  if (String(blacklist)) {
    if (!message.content.includes("~blacklist remove")) { // innores the blacklist remove command
      if (blacklist.some(word => message.content.toLowerCase().includes(word))) {
        message.delete()
        message.reply("You cant say that here, you have been warned!")
      }
    }
  }
};
