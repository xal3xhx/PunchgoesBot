const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": "",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [""],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],

  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  "token": "",

  "google": "",

  "channel": "",

  "twitchkey": "",
  // Intents the bot needs.
  // By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
  // For join messages to work you need Guild Members, which is privileged and requires extra setup.
  // For more info about intents see the README.
  intents: ["GUILDS","GUILD_MESSAGES","DIRECT_MESSAGES"],

  // Default per-server settings. New guilds have these settings. 

  // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
  // VIA COMMANDS IN THE GUILD.
  
  "defaultSettings" : {
    "prefix": "~",
    "modRole": "Discord Mod",
    "adminRole": "Admin",
    "tmodRole": "Trial Mod",
    "tadminRole": "Trial Admin",
    "twitchMod": "Twitch Mod",
    "SrMod": "SrMod",
    "SrAdmin": "SrAdmin",
    "severManager": "Manager",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "welcomeEnabled": "false",
    "welcomeChannel": "welcome",
    "modLogChannel": "mod-log",
    "streamchannel": "stream-announcements",
    "youtubechannel": "upload-announcements",
    "blacklist": ['cunt']
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    

    { level: 1,
      // This is the name of the role.
      name: "Twitch Mod",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const twitchMod = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.twitchMod.toLowerCase());
          if (twitchMod && message.member.roles.cache.has(twitchMod.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 2,
      name: "Trial Mod",
      check: (message) => {
        try {
          const tmodRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.tmodRole.toLowerCase());
          if (tmodRole && message.member.roles.cache.has(tmodRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      // This is the name of the role.
      name: "Discord Mod",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "SrMod", 
      check: (message) => {
        try {
          const SrMod = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.SrMod.toLowerCase());
          return (SrMod && message.member.roles.cache.has(SrMod.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 5,
      // This is the name of the role.
      name: "Trial Admin",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const tadminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.tadminRole.toLowerCase());
          if (tadminRole && message.member.roles.cache.has(tadminRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 6,
      // This is the name of the role.
      name: "Admin",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          if (adminRole && message.member.roles.cache.has(adminRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 7,
      name: "SrAdmin", 
      check: (message) => {
        try {
          const SrAdmin = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.SrAdmin.toLowerCase());
          return (SrAdmin && message.member.roles.cache.has(SrAdmin.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 8,
      name: "Manager", 
      check: (message) => {
        try {
          const severManager = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.severManager.toLowerCase());
          return (severManager && message.member.roles.cache.has(severManager.id));
        } catch (e) {
          return false;
        }
      }
    },

    // This is the server owner.
    { level: 15,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 18,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 19,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 20,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
