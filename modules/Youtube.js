const config = require("../config.js");
const Discord = require('discord.js');
const startAt = Date.now();
const Parser = require("rss-parser");
const lastVideos = {};
parser = new Parser({customFields: {item: [['media:group', 'media', {keepArray: true}],]}})
settings = config

exports.getLastVideo = async (youtubeChannelName, rssURL, client) => {
    let content = await parser.parseURL(rssURL);
    let tLastVideos = content.items.sort((a, b) => {
        let aPubDate = new Date(a.pubDate || 0).getTime();
        let bPubDate = new Date(b.pubDate || 0).getTime();
        return bPubDate - aPubDate;
    });
    client.logger.log(`[${youtubeChannelName}]  | The last video is "${tLastVideos[0] ? tLastVideos[0].title : "err"}"`, "youtube");
    return tLastVideos[0];
};

exports.checkVideos = async (youtubeChannelName, rssURL, client) => {
    let lastVideo = await this.getLastVideo(youtubeChannelName, rssURL, client);
    if(!lastVideo) return client.logger.log(`[ERR] | No video found for ${lastVideo}`, "youtube");
    if(new Date(lastVideo.pubDate).getTime() < startAt) return client.logger.log(`[${youtubeChannelName}] | Last video was uploaded before the bot starts`, "youtube");
    let lastSavedVideo = lastVideos[youtubeChannelName];
    if(lastSavedVideo && (lastSavedVideo.id === lastVideo.id)) return client.logger.log(`[${youtubeChannelName}] | Last video is the same as the last saved`, "youtube");
    return lastVideo;
};

exports.rss = async (client) => {
    const youtubeChannelName = "punchgoesbig"
    let video = await this.checkVideos(youtubeChannelName, `https://www.youtube.com/feeds/videos.xml?channel_id=${settings.channel}`, client);
    if(!video) return client.logger.log(`[${youtubeChannelName}] | No notification`, "youtube");
    lastVideos[youtubeChannelName] = video;
    this.announceVideo(video, client)
};

exports.announceVideo = async (video, client) => {
    return await client.channels.cache.find(c => c.name === settings.defaultSettings.youtubechannel).send(`@everyone PuncH just uploaded a new video, go give it some love! ${video.link}`);
};