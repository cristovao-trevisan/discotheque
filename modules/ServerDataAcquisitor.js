var SocketIO = require('socket.io-client')
var Rx = require('rx')
import * as actions from '../actions'

class ServerDataAcquisitor {
  constructor(store){
    this.socket = SocketIO('localhost:3000')

    // events subscriptions
    const artist$ = Rx.Observable.fromEvent(this.socket, 'artist')
    this.artistSubscription = artist$
      .map(artist => actions.addArtist(artist))
      .subscribe(action => store.dispatch(action))

    const album$ = Rx.Observable.fromEvent(this.socket, 'album')
    this.albumSubscription = album$
      .map(album => actions.addAlbum(album))
      .subscribe(action => {
        console.log(action)
        store.dispatch(action)
      })

    const song$ = Rx.Observable.fromEvent(this.socket, 'song')
    this.songSubscription = song$
      .map(song => actions.addSong(song))
      .subscribe(action => store.dispatch(action))

    const playlist$ = Rx.Observable.fromEvent(this.socket, 'playlist')
    this.playlistSubscription = playlist$
      .map(playlist => actions.addPlaylist(playlist))
      .subscribe(action => store.dispatch(action))

    this.socket.on('connect_error', () => this.onAuthFailure())
  }

  /**
   * @param {string} topic socket.io event name to be sent
  */
  getTopic(topic, data){
    this.socket.emit(topic, data)
  }

  /**
   * Called to reload page when auth fails
  */
  onAuthFailure(){
    window.location.reload()
  }

}

export default ServerDataAcquisitor
