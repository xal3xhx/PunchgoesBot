// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const config = require("./config.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Discord.Client({
  ws: {
    intents: config.intents
  }
});

// Here we load the config file that contains our token and our prefix values.
client.config = config
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Require our logger
client.logger = require("./modules/Logger");

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Loads the youtube upload handler
Youtube = require('./modules/Youtube');

Twitch = require('./modules/Twitch');


// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome EnMap module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.
client.settings = new Enmap({name: "settings"});
client.bans = new Enmap({name: "bans"});
client.mutes = new Enmap({name: "mutes"});
client.modcase = new Enmap({name: "modcase"});


// some awesome code to make .setinterval asyncable
const setIntervalAsync = (fn, ms) => {
  fn().then(() => {
    setTimeout(() => setIntervalAsync(fn, ms), ms);
  });
};

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  });

  // Generate a cache of client permissions for pretty perm names in commands.
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Here we login the client.
  client.login(client.config.token);

// End top-level async/await function.

};

init();


client.setInterval(() => {
  Youtube.rss(client)
  Twitch.checkStream(client)
},10000)

// setIntervalAsync(() => Twitch.checkStream(client), 5000)
// setIntervalAsync(() => Youtube.rss(client), 5000)


// goes over the list of bans and mutes to see if they will be unbaned/muted
client.setInterval(() => {
  bans = client.bans.fetchEverything()
  mutes = client.mutes.fetchEverything()

  mutes.forEach(async (r) => {
    r = JSON.parse(r)
    let guild = await client.guilds.cache.get(r.guild);
    if(!guild) return;
    let member = await guild.members.fetch(r.userid);
    if(!member) return;

    if(Date.now() > new Date(r.unmuteAt).valueOf()) {

      value = r.casenum
      settings = client.getSettings(guild)

      username = `${member.user.username}#${member.user.discriminator}`
      console.log(`unmuted: ${username}`)
      
      let mutedRole = member.roles.cache.find(r => r.name === settings.mutedRole);
      guild.members.cache.get(member.id).roles.remove(mutedRole);

      client.mutes.delete(value)    

      currrentcase = client.modcase.get(value)
      updated = await client.modcase.update(value, {"pardoned": true} ) // updates the database with the new reason
      await client.modcase.set(String(value), updated)

      modchannel = await guild.channels.cache.find(c => c.name === settings.modLogChannel)
      oldmessage = await modchannel.messages.fetch(currrentcase.messageid)

      description = String(oldmessage.embeds[0].description)
      author = oldmessage.embeds[0].author.name
      const regex = /\*\*pardoned\*\*:.*/i;
      description = description.replace(regex, `pardoned: true`)
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${author}`)
        .setColor("RED")
        .setDescription(`${description}`)
        .setTimestamp()

      oldmessage.edit(embed)
    }
  });

  bans.forEach(async (r) => {
    r = JSON.parse(r)
    let guild = await client.guilds.cache.get(r.guild);
    if(!guild) return;
    let member = await guild.members.fetch(r.userid);
    if(!member) return;

    if(Date.now() > new Date(r.unbanAt).valueOf()) {

      value = r.casenum
      settings = client.getSettings(guild)

      username = `${member.user.username}#${member.user.discriminator}`
      console.log(`unbanned: ${username}`)

      guild.fetchBans().then(bans=> {
        if(bans.size == 0) return 
        let bUser = bans.find(b => b.user.id == r.userid)
        if(!bUser) return
        guild.members.unban(bUser.user)
      })
      client.bans.delete(value)    

      currrentcase = client.modcase.get(value)
      updated = await client.modcase.update(value, {"pardoned": true} ) // updates the database with the new reason
      await client.modcase.set(String(value), updated)

      modchannel = await guild.channels.cache.find(c => c.name === settings.modLogChannel)
      oldmessage = await modchannel.messages.fetch(currrentcase.messageid)

      description = String(oldmessage.embeds[0].description)
      author = oldmessage.embeds[0].author.name
      const regex = /\*\*pardoned\*\*:.*/i;
      description = description.replace(regex, `pardoned: true`)
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${author}`)
        .setColor("RED")
        .setDescription(`${description}`)
        .setTimestamp()

      oldmessage.edit(embed)
    }
  });
}, 2000);
