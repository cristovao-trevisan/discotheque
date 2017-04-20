/**
* This is a script to create torrent files for all music inside a folder and save
* them using the same folder structure
*/

// -------------------requires---------------------------------------------------
// native
const fs = require('fs')
const path = require('path')
// npm package
const createTorrent = require('create-torrent')
const jsonfile = require('jsonfile')
const mkpath = require('mkpath')
const mp3Duration = require('mp3-duration')
// local
const db = require('../database')
const { inputPath, torrentPath, picturesPath } = require('./config')
// --------------------constants------------------------------------------------
const domain = 'https://vps2127.publiccloud.com.br/'
// --------------------useful functions------------------------------------------
// checks if file name termination matches a music type (defined in musicTypes)
const copyFile = (origin, destination) => fs.createReadStream(origin).pipe(fs.createWriteStream(destination))

// -------------------------------- search for files ---------------------------
const processSong = (songPath, title, order, album, artist) => {
  db.Song.findOrCreate({ where: { title, albumId: album.get('id') } })
    .spread((song, created) => {
      song.update({ order })
      mp3Duration(songPath, function (err, duration) {
        if (err) throw err
        song.update({ duration })
      })
      var webSeedpath = songPath.slice(songPath.lastIndexOf('music') + 'music'.length)
      webSeedpath = encodeURI(domain + 'music' + webSeedpath)
      createTorrent(songPath, { urlList: [webSeedpath] }, (err, torrent) => {
        if (err) throw err
        mkpath(path.join(torrentPath, artist.get('name'), album.get('title')), err => {
          if (err) throw err

          song.update({ torrent: path.join(artist.get('name'), album.get('title'), title + '.torrent') })
          fs.writeFile(path.join(torrentPath, artist.get('name'), album.get('title'), title + '.torrent'), torrent, err => {
            if (err) throw err
          })
        })
      })
    })
}

const processAlbum = (albumFolder, artist) => {
  jsonfile.readFile(path.join(albumFolder, 'album.json'), (err, config) => {
    if (err) throw err
    var { title, tags } = config
    db.Album.findOrCreate({ where: { title, artistId: artist.get('id') } })
      .spread((album, created) => {
        album.setTags([]).then(() => {
          tags.forEach(tagName => {
            db.Tag.findOrCreate({ where: { name: tagName } }).spread(tag => {
              album.addTag(tag).catch(() => {})
            })
          })
        })
        mkpath(path.join(picturesPath, artist.get('name'), title), err => {
          if (err) throw err
          var picturePath = path.join(picturesPath, artist.get('name'), title, 'cover.png')
          copyFile(path.join(albumFolder, 'cover.png'), picturePath)
          album.update({ picturePath })
        })
        config.songs.forEach((song, i) => {
          processSong(path.join(albumFolder, song.file), song.title, i + 1, album, artist)
        })
        fs.readFile(path.join(albumFolder, 'description.html'), 'utf8', (err, description) => {
          if (err) throw err
          album.update({ description })
        })
      })
  })
}

const processArtist = artistFolder => {
  jsonfile.readFile(path.join(artistFolder, 'artist.json'), (err, config) => {
    if (err) throw err
    var { id, name, tags } = config
    db.Artist.findOrCreate({ where: {id}, defaults: { name } })
      .spread((artist, created) => {
        artist.setTags([]).then(() => {
          tags.forEach(tagName => {
            db.Tag.findOrCreate({ where: { name: tagName } }).spread(tag => {
              artist.addTag(tag).catch(() => {})
            })
          })
        })
        mkpath(path.join(picturesPath, name), err => {
          if (err) throw err
          var picturePath = path.join(picturesPath, name, 'picture.png')
          copyFile(path.join(artistFolder, 'picture.png'), picturePath)
          artist.update({ picturePath })
        })
        fs.readFile(path.join(artistFolder, 'description.html'), 'utf8', (err, description) => {
          if (err) throw err
          artist.update({ description })
        })
        fs.readdir(artistFolder, (err, files) => {
          if (err) throw err
          files.forEach(file => {
            fs.stat(path.join(artistFolder, file), (err, stat) => {
              if (err) throw err
              // may be artist
              if (stat.isDirectory()) {
                fs.stat(path.join(artistFolder, file, 'album.json'), (err, stat) => {
                  if (err) throw err
                  processAlbum(path.join(artistFolder, file), artist)
                })
              }
            })
          })
        })
      })
  })
}

// initialize search stack
fs.readdir(inputPath, (err, files) => {
  if (err) return
  files.forEach(file => {
    fs.stat(path.join(inputPath, file), (err, stat) => {
      if (err) return
      // may be artist
      if (stat.isDirectory()) {
        fs.stat(path.join(inputPath, file, 'artist.json'), (err, stat) => {
          if (err) return
          processArtist(path.join(inputPath, file))
        })
      }
    })
  })
})
