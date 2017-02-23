import * as actions from '../actions'
import {PLAYER_TIME_RANGE} from '../constants'

class Player {
  static client = new WebTorrent({dht: false})
  static addProps = {announce:['ws://127.0.0.1:3002']}

  constructor(store){
    this.store = store
    var state = store.getState().player
    this.song = state.song
    this.time = state.time
    this.playlistId = state.playlist.id

    this.audio = new Audio()
    this.play = this.play.bind(this)
    this.torrentBlob$ = null

    this.audio.ontimeupdate = () => {
      var time = Math.round(this.audio.currentTime)
      if(Math.abs(time - this.time) > 0)
        this.store.dispatch(actions.playTime(time))
    }
    this.store.subscribe(this.onChange.bind(this))
  }

  timeWithinRange(time){
    return (time < this.audio.currentTime + PLAYER_TIME_RANGE && time > this.audio.currentTime - PLAYER_TIME_RANGE)
  }

  /**
   * @param {string} infoHash Hex string
  */
  findTorrentByHash(infoHash){
    return Player.client.torrents.find(tor => tor.infoHash === infoHash)
  }

  /**
   * @param {Object} song Song object
   * @param {song} song.infoHash Song's hash
   * @param {number} song.duration Song's duration

  */
  add(song){
    if(!this.findTorrentByHash(song.infoHash)){
      Player.client.add(song.infoHash, Player.addProps, (torrent) => {
        this.play(song)
      })
    }
  }

  /**
   * @param {Object|undefined} song Song object
   * @param {song} song.infoHash Song's hash
   * @param {number} song.duration Song's duration

  */
  play(song){
    if(song === undefined){
      this.audio.play().catch(err => {})
    }
    if(!this.song || song.infoHash !== this.song.infoHash){
      var torrent = this.findTorrentByHash(song.infoHash)
      if(torrent !== undefined){
        this.song = song
        torrent.files[0].getBlobURL((err, blob) => {
          if(!err){
            this.audio.src = blob
            this.audio.play()
          }
        })
      }
      else{
        this.add(song)
      }
    }
    else if(this.audio.paused){
      this.audio.play().catch(err => {})
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
    var player = state.player
    if(player.isPlaying){
      this.play(player.song)
    }
    else {
      this.pause()
    }
    if(!this.timeWithinRange(player.time)){
      this.setTime(player.time)
    }
    if(player.playlist.id !== player.playlistId){
      for(let i in player.playlist.songs){
        var song = state.data.songs[player.playlist.songs[i]]
        if(song !== undefined)
          this.add(song)
      }
    }
    this.time = player.time
  }
}

module.exports = Player
