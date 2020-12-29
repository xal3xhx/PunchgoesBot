const http = require('https');
const fs = require('fs');
const util = require('util');
const Enmap = require("enmap");
const enmapcache = new Enmap({name: "youtube cache"});
const config = require("../config.js");
const Discord = require('discord.js')
settings = config

exports.checkvideo = async (client) => {
	const req = http.request({
		hostname: `www.googleapis.com`,
		port: 443,
		path: `/youtube/v3/search?part=snippet&channelId=${settings.channel}&maxResults=1&order=date&type=video&key=${settings.google}`,
		method: `GET`
	}, res => {
		let str = '';
		res.on('data', chunk => {
			str += chunk;
		});
		res.on('end', async () => {
			try {
				const video = JSON.parse(str).items[0];
				enmapcache.clear()
				cache = await this.readcache()
				console.log(cache[0])
					if(video.id.videoId != cache[0]) {
						console.log("no match")
						this.writecache(video.id.videoId)
						this.announceVideo(video,client)
					}
					else {
						console.log("match")
					}
			} catch (e) {
				console.log(e, str);
			}
		});
	});
	req.on('error', e => {
		console.log(e);
	});
	req.end();
};

exports.announceVideo = async (video,client) => {
	var embed = new Discord.MessageEmbed()
	    // .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	    .addField(`test`)
	    .setTimestamp()
	    // .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)

	// client.channels.cache.find(c => c.name === settings.modLogChannel).send(``,{embed}).catch(console.error);
	// console.log(client.channels.cache.find(c => c.name === settings.modLogChannel))
	console.log(client.guilds.get)
};

exports.readcache = async () => {
	return await enmapcache.fetchEverything().array();    
};

exports.writecache = async (data) => {
	enmapcache.clear()
	enmapcache.set('youtube', data)
};