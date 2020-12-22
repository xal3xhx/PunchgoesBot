


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send(`Hello there ${message.author.username}`);
  const count = int(client.logs.count)
  // const everything = await client.logs.fetchEverything()
  const last10 = await client.logs.fetch(Array(Math.ceil((count - count-11) / 1)).fill(count-10).map((x, y) => x + y * 1))
  var keys = Object.keys(last10);
	keys.forEach(key=>{
	  message.channel.send(`logs: ${last10[key]}`)
	});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "admin"
};

exports.help = {
  name: "getlogs",
  category: "system",
  description: "gets the message logs.",
  usage: " "
};
