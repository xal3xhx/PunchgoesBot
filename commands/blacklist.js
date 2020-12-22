// this command allows you to add or remove new words to the server blacklist


exports.run = async (client, message, [action, ...value], level) => { // eslint-disable-line no-unused-vars
  
  const settings = message.settings;
  const current = settings.blacklist
  // client.message.send(`The current blacklist is: ${current}`)
  // if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

  const joinedValue = value.join(" ");

    if (!action) return message.reply("Please specify a command.");

   if (action === "view") {
   		await message.reply(`The current blacklist is: \`\`\`\n${current}\n\`\`\``)
   } else
   if (action === "add") {
   		var updated = current + "," + joinedValue
   		var updated = updated.replace(/, /g, ",").replace(/,,/g, ",").replace(/\,$/, "").replace(/\,/, "")
   		await client.settings.set(message.guild.id, updated, "blacklist");
   		await message.reply(`\`\`\`\n${updated}\n\`\`\` has been added to the blacklist`)
   } else
   if (action === "remove") {
   		var updated = current.replace(`${joinedValue}`, "").replace(/, /g, ",").replace(/,,/g, ",").replace(/\,$/, "").replace(/\,/, "")
   		await client.settings.set(message.guild.id, updated, "blacklist");
   		await message.reply(`\`\`\`\n${updated}\n\`\`\` has been removed from the blacklist`)
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
