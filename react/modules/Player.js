import http from 'stream-http'
import parseTorrent from 'parse-torrent'
import * as actions from '../actions'
import { PLAYER_TIME_RANGE, TORRENT_PATH } from '../constants'

class Player {
  static client = new WebTorrent()
  static addProps = {announce:['ws://127.0.0.1:3002']}

  constructor(store){
    this.store = store

    this.audio = new Audio()
    this.play = this.play.bind(this)

    this.currentSong = undefined

    this.audio.ontimeupdate = () => {
      var time = Math.round(this.audio.currentTime)
      if(Math.abs(time - this.time) > 0)
        this.store.dispatch(actions.playTime(time))
    }
    this.store.subscribe(::this.onChange)

    this.songTorrent = {}
  }

  timeWithinRange(time){
    return (time < this.audio.currentTime + PLAYER_TIME_RANGE && time > this.audio.currentTime - PLAYER_TIME_RANGE)
  }

  /**
   * @param {Object|undefined} song Song object
   * @param {song} song.torrent Song's torrent relative path
  */
  play(song){
    if (this.currentSong === undefined || (song !== undefined && song.id !== this.song.id)) {
      this.audio.pause()
      // song not added yet
      if (this.songTorrent[song.id] === undefined) {
        this.songTorrent[song.id] = false
        // load torrent
        http.get(TORRENT_PATH + song.torrent, (res) => {
          var data = []
          res.on('data', chunk => {
            data.push(chunk) // Append Buffer object
          })

          // torrent reay
          res.on('end', () => {
            data = Buffer.concat(data)
            // parse torrent
            var torrentParsed = parseTorrent(data)
            console.log(torrentParsed)
            // add torrent to the webtorrent instance
            Player.client.add(torrentParsed, torrent => {
              // save torrent instance on songTorrent object
              this.songTorrent[song.id] = { torrent }
              // get blob url for torrent
              this.songTorrent.files[0].getBlobURL((err, url) => {
                if (err) return
                // save blob url
                this.songTorrent[song.id].url = url
                // if song is still the current one
                if (this.currentSong === song) {
                  this.audio.url = url
                  // if state should be playing just play
                  if (this.store.getState().player.isPlaying) this.audio.play().catch(() => {})
                }
              })
            })
          })
        })
      // song already added
      } else if (this.songTorrent[song.id]) {
        // torrent file blob url already loaded
        if (this.songTorrent[song.id].url) {
          if (this.audio.url !== this.songTorrent[song.id].url) {
            this.audio.url = this.songTorrent[song.id].url
            this.audio.play().catch(() => {})
          }
        }
      }
    }
  }

  pause(){
    this.audio.pause()
  }

  setTime(time){
    this.audio.currentTime = time
  }

  onChange(){
    var state = this.store.getState()
    var { player } = state
    if (player.isPlaying) {
      if (this.audio.paused) this.audio.play().catch(() => {})
      if (this.currentSong !== player.song) {
        this.play(player.song)
      }
    }
    else {
      this.pause()
    }
    if (!this.timeWithinRange(player.time)) {
      this.setTime(player.time)
    }
    if (player.playlist.id !== player.playlistId) {
      // some playlist algorithm
    }
  }
}

module.exports = Player
