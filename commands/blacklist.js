// this command allows you to add or remove new words to the server blacklist


exports.run = async (client, message, [action, ...value], level) => { // eslint-disable-line no-unused-vars
  
  const settings = message.settings;
  const current = settings.blacklist
  const joinedValue = value.join(" ");

    if (!action) return message.reply("Please specify a command.");

   if (action === "view") {
   		await message.reply(`The current blacklist is: \`\`\`\n${current}\n\`\`\``)
   } else
   if (action === "add") {
      await current.push(joinedValue)
      await client.logger.log(current)
   		await client.settings.set(message.guild.id, current, "blacklist");
   		await message.reply(`\`\`\`\n${joinedValue}\n\`\`\` has been added to the blacklist`)
   } else
   if (action === "remove") {
    if (!joinedValue) return message.reply("you need to specify a value");
    pos = current.indexOf(joinedValue)
    if (pos === -1) return message.reply("word not found in the blacklist");
      current.splice(pos, 1)
   		await client.settings.set(message.guild.id, current, "blacklist");
   		await message.reply(`\`\`\`\n${joinedValue}\n\`\`\` has been removed from the blacklist`)
   } else {
   	await message.reply(`command entered was incorrect.`)
   }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "admin"
};

exports.help = {
  name: "blacklist",
  category: "blacklist",
  description: "blacklist",
  usage: "blacklist"
};
