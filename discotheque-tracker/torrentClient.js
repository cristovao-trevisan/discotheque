var WebTorrent = require('webtorrent-hybrid')
var config = require('./config')

const trackers = ['ws://'+config.host+':'+config.port]

var client = new WebTorrent()

client.seed('../../music/Cristóvão Trevisan/Estrada.mp3', {
  announceList: [trackers]
}, function (torrent) {
 console.log('Client is seeding:', torrent.infoHash)
})
