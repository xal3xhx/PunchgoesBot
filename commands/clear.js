exports.run = async (client, message, [action, ...value], level) => {

message.channel.bulkDelete(100).then(messages => console.log(`Bulk deleted ${messages.size} message(s)`)).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "owner"
};

exports.help = {
  name: "clear",
  category: "moderation",
  description: "WARNING CLEARS ALL THE MESSAGES IN THE CURRENT CHANNEL!",
  usage: "clear"
};
