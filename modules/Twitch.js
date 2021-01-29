const config = require("../config.js");
const Discord = require('discord.js');
const startAt = Date.now();
let streaming = false

const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');


const clientId = 'y50o21184xyafkabdp58kq12mfcptw';
const clientSecret = 'zjj9pne4a6d3o3t2kcyv4prse6n2zt';
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });


// punch id: 141189217
// mine: 83530625
	
exports.checkStream = async (client) => {
	stream = await apiClient.helix.streams.getStreamByUserId(141189217);
	if(!stream) {
		streaming = false
		return client.logger.log("Stream is not live.", "Twitch")
	}
	else {
		if (streaming) return client.logger.log("Stream is Live, not sending notifaction.", "Twitch")
		streaming = true
    	if(new Date(stream.startDate).getTime() < startAt) return client.logger.log(`Stream was already live when the bot was started!`, "Twitch");
		client.logger.log("Stream is Live, sending notifaction!", "Twitch")
		return console.log("STREAM LIVE BBY")
		return await client.channels.cache.find(c => c.name === settings.defaultSettings.streamchannel).send(`@ everyone PuncH is live over on twitch! It looks like we’re playing *${stream.getGame().name}* tonight! https://www.twitch.tv/punchgoesbig`);
	}
};