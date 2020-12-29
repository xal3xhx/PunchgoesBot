const http = require('https');
const fs = require('fs');
const util = require('util');
const Enmap = require("enmap");
let cache
const enmapcache = new Enmap({name: "youtube cache"});
const config = require("../config.js");
settings = config

exports.checkvideo = () => {
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
		res.on('end', () => {
			try {
				const video = JSON.parse(str).items[0];
				console.log(video.id.videoId)
				cache = this.readcache()
					if(video.id.videoId != cache[0]) {
						console.log("no match")
						this.writecache(video.id.videoId)
					}
					else {
						console.log("match")
					}
				// if(video.id.videoId != cache[settings.channel]) {
					// this.announceVideo(video, settings.channel);
					// this.writecache(video.id.videoId, settings.channel);
					// client.logger.log(`[YOUTUBE] Found ${video.id.videoId} - ${video.snippet.title}`);
				// }
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

exports.announceVideo = (video,channel) => {
	const data = {
		username: config.embed.username,
		avatar_url: config.embed.avatar,
		embeds: [
			{
				color: config.colors[channel],
				title: video.snippet.title,
				image: video.snippet.thumbnails.high,
				url: `https://youtu.be/${video.id.videoId}`,
				footer: {
					text: config.embed.footer
				}
			}
		]
	};
};

exports.readcache = () => {
	return new Promise(resolve => {
		data = enmapcache.fetchEverything().array();
    	resolve(data)	    
	});
};

exports.writecache = (data) => {
	enmapcache.clear()
	enmapcache.set('youtube', data)
};