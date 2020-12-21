exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send(`Hello there ${message.author.username}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "admin"
};

exports.help = {
  name: "test",
  category: "testing",
  description: "testing",
  usage: "test"
};
