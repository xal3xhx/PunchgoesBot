const config = require("../config.js");
const Discord = require('discord.js');
const api = require('twitch-api-v5');
const startAt = Date.now();
let streaming = false

api.clientID = config.twitchkey;

// punch id: 141189217
// mine: 83530625

exports.getStreamInfo = async () => {
	return await new Promise((resolve, reject) => {
		api.streams.channel({ channelID: '141189217' }, (err, res) => {
	    if(err) {
	        return null
	    } else {
	    	resolve(res)
	    }
		});
	});
};
   
exports.checkStream = async (client) => {
	stream = await this.getStreamInfo()
	if(!stream.stream) {
		streaming = false
		return client.logger.log("Stream is not live.", "Twitch")
	}
	else {
		if (streaming) return client.logger.log("Stream is Live, not sending notifaction.", "Twitch")
		streaming = true
    	if(new Date(stream.stream.created_at).getTime() < startAt) return client.logger.log(`Stream was already live when the bot was started!`, "Twitch");
		if (stream.stream.game == "") return client.logger.log("No game found.", "Twitch")
		client.logger.log("Stream is Live, sending notifaction!", "Twitch")
		return await client.channels.cache.find(c => c.name === settings.defaultSettings.streamchannel).send(`@ everyone PuncH is live over on twitch! It looks like we’re playing *${stream.stream.game}* tonight! ${stream.stream.channel.url}`);
	}
};