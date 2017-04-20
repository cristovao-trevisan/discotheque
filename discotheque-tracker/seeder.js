/**
  This script finds all songs under the music folder, checks if they are listed
  in the database and start seeding the ones that are
*/
const WebTorrent = require('webtorrent-hybrid')
const fs = require('fs')

// tracker info
const trackers = ['ws://127.0.0.1:3002']
// music folder
const baseMusicPath = '../../music'
// allowed types
const musicTypes = ['mp3']

// checks if the file extension matches with the allowed types array
const isMusicFile = fileName => {
  var dotIndex = fileName.lastIndexOf('.')
  if (dotIndex < 0) return false
  return musicTypes.indexOf(fileName.slice(dotIndex + 1)) >= 0
}

// initialize search stack
var search = fs.readdirSync(baseMusicPath)
search.forEach((ele, i) => {
  search[i] = baseMusicPath + '/' + ele
})

var files = []
// search all things
while (search.length > 0) {
  var s = search.pop()
  var stat = fs.lstatSync(s)
  // found a file
  if (stat.isFile() && isMusicFile(s)) {
    files.push(s)
  } else if (stat.isDirectory()) { // found a dir -> add its contents to the search
    var addSearch = fs.readdirSync(s)
    addSearch.forEach((ele) => {
      search.push(s + '/' + ele)
    })
  }
}

var client = new WebTorrent()
client.dht.setMaxListeners(0)
// seed the file given by the path
function seedFile (file) {
  console.log('Trying to seed: ' + file)
  client.seed(file, { announce: trackers }, (torrent) => console.log('Client is seeding file "' + file + '" with infoHash:', torrent.infoHash))
  // setTimeout(() => console.log(client.torrents[0].announce), 1000)
}

// seed each file from stream
for (let i in files) {
  seedFile(files[i])
}
