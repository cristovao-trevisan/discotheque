/**
  This script finds all songs under the music folder, checks if they are listed
  in the database and start seeding the ones that are
*/
const WebTorrent = require('webtorrent-hybrid')
const config = require('./config')
const db = require('../database')
const fs = require('fs')
const Rx = require('rx')
const mm = require('musicmetadata')

// tracker info
const trackers = ['http://'+config.host+':'+config.port]
// music folder
const  baseMusicPath = '../../music'
// allowed types
const musicTypes = ['mp3', 'flac']

// checks if the file extension matches with the allowed types array
const isMusicFile = fileName => {
  var dotIndex = fileName.lastIndexOf('.')
  if(dotIndex<0) return false
  return musicTypes.indexOf(fileName.slice(dotIndex+1)) >= 0
}

// initialize search stack
var search = fs.readdirSync(baseMusicPath)
search.forEach((ele, i) => {
  search[i] = baseMusicPath+'/'+ele
})

// Music's file stream
var file$ = new Rx.Subject()

// search all things
while(search.length > 0){
  var s = search.pop()
  var stat = fs.lstatSync(s)
  // found a file
  if(stat.isFile() && isMusicFile(s)){
    // saving file path in this scope
    (function (file) {
      // gets file information
      mm(fs.createReadStream(file), {duration: true}, (err, metadata) => {
        if (err) return
        // checks if song is in the database
        db.Song.findOne({
          where: {title: metadata.title, duration: metadata.duration},
          include: [{ model: db.Album, where: { title: metadata.album }}]
        }).then((song) => {
          // if it is add it to the file stream
          if(song !== null)
            file$.onNext(s)
        }).catch(() => {})
      })
    })(s)
  }
  // found a dir -> add its contents to the search
  else if(stat.isDirectory()){
    var addSearch = fs.readdirSync(s)
    addSearch.forEach((ele) => {
      search.push(s+'/'+ele)
    })
  }
}

var client = new WebTorrent()
// seed the file given by the path
function seedFile(file){
  console.log('Trying to seed '+file)
  client.seed(file, { announce: trackers }, (torrent) => console.log('Client is seeding file "' + file + '" with infoHash:', torrent.infoHash) )
  setTimeout(() => console.log(client.torrents[0].announce), 1000)
}

// seed each file from stream
file$.subscribe(file => seedFile(file))
