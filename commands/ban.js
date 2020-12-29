exports.run = async (client, message, [target, ...res], level) => { // eslint-disable-line no-unused-vars

if(!target) return message.channel.send("Please provide a valid mention or ID.");

let user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(()=>{console.log("error")}) || null;
let reason = res.join(" ")

if(!user) return message.channel.send("Please provide a valid mention or ID.");
if(!user.bannable) return message.channel.send("I cannot ban this user.");
if (!reason) reason = "No reason given.";

message.channel.send("ban")

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "ban",
  category: "management",
  description: "ban",
  usage: "ban"
};
