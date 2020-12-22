

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // const msg = await message.channel.send(`Hello there ${message.author.username}`);
  const count = Number(client.logs.count)
  // const everything = await client.logs.fetchEverything()
  const last10 = await client.logs.fetch(Array(Math.ceil((count - (count-11)) / 1)).fill(count-10).map((x, y) => x + y * 1))
  // client.logger.log(keys)
  // const evaled = eval(client.logs.fetch([100,101,103]);
  // const clean = await client.clean(client, evaled);
	// await message.channel.send(evaled)
  // client.logger.log(Array(Math.ceil((count - (count-11)) / 1)).fill(count-10).map((x, y) => x + y * 1).value)
  // client.logger.log(clean)
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
