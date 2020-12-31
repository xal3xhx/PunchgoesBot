const config = require("../config.js");
const Discord = require('discord.js');
const api = require('twitch-api-v5');

api.clientID = config.twitchkey;
// punch id: 141189217

api.users.usersByName({ users: 'jacksepticeye' }, (err, res) => {
    if(err) {
        return null
    } else {
    	return res.users[0]['_id']
    }
});

console.log(test)

exports.getStreamInfo = async () => {
	api.streams.channel({ channelID: '44578737' }, (err, res) => {
	    if(err) {
	    	console.log("fuck")
	        return null
	    } else {
	    	return res
	    }
	});
}
   
exports.checkStream = async (client) => {
	stream = await this.getStreamInfo()
	// console.log(stream)
	// if(!stream) return client.logger.log("Stream is not live.", "Twitch")
};

exports.announceStream = async (video, client) => {
	// const embed = new Discord.MessageEmbed()
	// 	.setAuthor(`[PunchgoesBig] | ${video.title}`)
	// 	.setThumbnail(video.media[0]['media:thumbnail'][0]['$']['url'])
	// 	.setColor("RED")
	// 	.setTimestamp()

	client.channels.cache.find(c => c.name === settings.defaultSettings.modLogChannel).send(`@everyone PuncH just uploaded a new video, go give it some love! ${video.link}`);
};