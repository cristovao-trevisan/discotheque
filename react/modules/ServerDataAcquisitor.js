var SocketIO = require('socket.io-client')
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import * as actions from '../actions'

class ServerDataAcquisitor {
  constructor(){
    this.emitedTopics = {}
  }

  init(store){
    this.socket = SocketIO('localhost:3000')
    this.getTopic = this.getTopic.bind(this)
    var _this = this
    // events subscriptions
    const artist$ = Observable.fromEvent(this.socket, 'artist')
    this.artistSubscription = artist$
      .map(artist => actions.addArtist(artist))
      .subscribe(action => store.dispatch(action))

    this.artistPictureRequests = artist$
      .subscribe(artist => _this.getTopic('artist-picture', artist.id))

    const album$ = Observable.fromEvent(this.socket, 'album')
    this.albumSubscription = album$
      .map(album => actions.addAlbum(album))
      .subscribe(action => store.dispatch(action))

    this.albumPictureRequests = album$
      .subscribe(album => _this.getTopic('album-picture', album.id))

    const song$ = Observable.fromEvent(this.socket, 'song')
    this.songSubscription = song$
      .map(song => actions.addSong(song))
      .subscribe(action => store.dispatch(action))

    const playlist$ = Observable.fromEvent(this.socket, 'playlist')
    this.playlistSubscription = playlist$
      .map(playlist => actions.addPlaylist(playlist))
      .subscribe(action => store.dispatch(action))

    const artistPicture$ = Observable.fromEvent(this.socket, 'artist-picture')
    this.artistPictureSubscription = artistPicture$
      .map(info => actions.addArtistPicture(info.id, 'data:image/png;base64,' + info.picture))
      .subscribe(action => store.dispatch(action))

    const albumPicture$ = Observable.fromEvent(this.socket, 'album-picture')
    this.albumPictureSubscription = albumPicture$
      .map(info => actions.addAlbumPicture(info.id, 'data:image/png;base64,' + info.picture))
      .subscribe(action => store.dispatch(action))

    this.socket.on('connect_error', () => this.onAuthFailure())
  }

  /**
   * @param {string} topic socket.io event name to be sent
  */
  getTopic(topic, data){
    if(this.emitedTopics[topic+'-'+data]) return
    var self = this
    self.emitedTopics[topic+'-'+data] = true
    this.socket.emit(topic, data)
  }

  /**
   * Called to reload page when auth fails
  */
  onAuthFailure(){
    //window.location.reload()
  }

}

export default ServerDataAcquisitor
