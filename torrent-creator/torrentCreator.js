/**
* This is a script to create torrent files for all music inside a folder and save
* them using the same folder structure
*/

//-------------------requires---------------------------------------------------
const createTorrent = require('create-torrent')
const parseTorrent = require('parse-torrent')
const mm = require('musicmetadata')
const fs = require('fs')
const mkpath = require('mkpath')
const db = require('../database')

//-------------------constants (change this for different folder structure)-----
// music folder
const baseMusicPath = '/home/cristovao/Documents/musicoteca/music'
// torrent output folder
const baseTorrentPath = '/home/cristovao/Documents/musicoteca/torrent'
// allowed music types
const musicTypes = ['mp3', 'flac']
// our tracker domain

const trackers = ['ws://127.0.0.1:3002']
// index to remove the music folder when creating torrents
const baseMusicIndex = baseMusicPath.lastIndexOf('/') + 1

//--------------------useful functions------------------------------------------
// checks if file name termination matches a music type (defined in musicTypes)
function isMusicFile(fileName){
  var dotIndex = fileName.lastIndexOf('.')
  if(dotIndex<0) return false
  return musicTypes.indexOf(fileName.slice(dotIndex+1)) >= 0
}

function copyFile(origin, destination){
  fs.createReadStream(origin).pipe(fs.createWriteStream(destination));
}


// initialize search stack
var search = fs.readdirSync(baseMusicPath)
search.forEach((ele, i) => {
  search[i] = baseMusicPath+'/'+ele
})

// put file paths here
var files = []

while(search.length > 0){
  var s = search.pop()
  var stat = fs.lstatSync(s)
  // found a file
  if(stat.isFile() && isMusicFile(s)){
    files.push(s)
  }
  // found a dir -> add its contents to the search
  else if(stat.isDirectory()){
    var addSearch = fs.readdirSync(s)
    addSearch.forEach((ele) => {
      search.push(s+'/'+ele)
    })
  }
}

//console.log(files)


// create and save torrent (has to be a function to save path locations for async createTorrent)
function createAndSaveTorrent(file){
  // torrent file complete path
  var torrentFile = baseTorrentPath + file.slice(file.indexOf('/', baseMusicIndex), file.lastIndexOf('.')) + '.torrent'
  // path to create
  var path = torrentFile.slice(0, torrentFile.lastIndexOf('/'))

  // check file
  fs.stat(torrentFile, (err) => {
    // if it doesn't exists
    if (err){
      // create the path
      mkpath.sync(path)
      //create the torrent
      createTorrent(file, { announceList:  [trackers] }, (err, torrent) => {
        if (err){
          throw err
        }
        // read metadata
        var stream = fs.createReadStream(file);
        mm(stream, {duration: true}, function(err, metadata){
          // done, now close the stream
          stream.close();
          if(err){
            throw new Error(err)
          }
          if(metadata.artist.length < 1){
            throw new Error('File "' + file + '" does not have artist')
          }
          if(!metadata.album){
            throw new Error('File "' + file + '" does not have album')
          }
          db.Artist.findOne({where: {name: metadata.artist[0]}}).then(function(artist){
            if(artist !== null){
              // read magnet to save in database
              var magnetURI = parseTorrent.toMagnetURI(parseTorrent(torrent))
              var infoHash = parseTorrent(magnetURI).infoHash
              // save song
              db.Song.findOrCreate({ where:{
                title: metadata.title,
                duration: metadata.duration,
                magnetURI: magnetURI,
                infoHash: infoHash
              }}).spread(song =>{
                db.Album.findOrCreate({
                  where: {
                    title: metadata.album
                  }
                }).spread(function(album, created) {
                  album.setArtist(artist.dataValues.id)
                  // write torrent - to seed clients
                  fs.writeFile(torrentFile, torrent)
                  song.setAlbum(album)
                  // cover path
                  var cover = file.slice(0, file.lastIndexOf('/')) + '/cover.png'
                  fs.stat(cover, err => {
                    if(!err){
                      fs.stat(path+'/cover.png', err => {
                        if(err){
                          album.set('picturePath', path+'/cover.png').save()
                          copyFile(cover, path+'/cover.png')
                        }
                      })
                    }
                  })
                })
              })
            }
            else {
              console.log('Invalid artist: ' + metadata.artist[0] + ' for file:' + file)
            }
          })
        })
      })
    }
  })
}

// for each file
for(let i in files){
  var file = files[i]
  // create and save torrent
  createAndSaveTorrent(file)
}
