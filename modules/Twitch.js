const config = require("../config.js");
const Discord = require('discord.js');
const api = require('twitch-api-v5');
const startAt = Date.now();
var streaming = false

api.clientID = config.twitchkey;
// punch id: 141189217

// api.users.usersByName({ users: 'admiralbahroo' }, (err, res) => {
//     if(err) {
//         return null
//     } else {
//     	console.log(res.users[0]['_id'])
//     }
// });

exports.getStreamInfo = async () => {
	return await new Promise((resolve, reject) => {
		api.streams.channel({ channelID: '40972890' }, (err, res) => {
	    if(err) {
	        return null
	    } else {
	    	resolve(res)
	    }
		});
	});
};
   
exports.checkStream = async (client) => {
	/*
	game: stream.stream.game
	title: stream.stream.channel.status
	*/


	stream = await this.getStreamInfo()
	if(!stream.stream) {
		streaming = false
		return client.logger.log("Stream is not live.", "Twitch")
	}
	if(stream.stream) {
    	if(new Date(stream.stream.created_at).getTime() < startAt) return client.logger.log(`Stream was already live when the bot was started!`, "Twitch");
		if (streaming == true) return client.logger.log("Stream is Live, not sending notifaction.", "Twitch")
		streaming = true
		client.logger.log("Stream is Live, sending notifaction!", "Twitch")
		this.announceStream(stream, client)
	}
};

exports.announceStream = async (video, client) => {
	// const embed = new Discord.MessageEmbed()
	// 	.setAuthor(`[PunchgoesBig] | ${video.title}`)
	// 	.setThumbnail(video.media[0]['media:thumbnail'][0]['$']['url'])
	// 	.setColor("RED")
	// 	.setTimestamp()

	client.channels.cache.find(c => c.name === settings.defaultSettings.streamchannel).send(`@everyone PuncH is live over on twitch! It looks like we’re playing *${stream.stream.game}* tonight! ${stream.stream.channel.url}`);
};