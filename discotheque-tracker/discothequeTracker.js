const Server = require('bittorrent-tracker').Server
const db = require('../database')
const config = require('./config')

var server = new Server({
  udp: true, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true, // enable web-based statistics? [default=true]
  filter: function (infoHash, params, cb) {
    // allow only the songs in database
    db.Song.find({
      where: {
        infoHash: infoHash
      }
    }).then((song) => {
      console.log(infoHash, song !== null)
      cb(song !== null ? null : new Error('disallowed torrent'))
    }).catch((err) => {
      console.log(err)
      cb(false)
    })
  }
})

server.listen(config.port)
