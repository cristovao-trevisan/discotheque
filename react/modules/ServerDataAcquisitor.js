import * as actions from '../actions'
import * as popsicle from 'popsicle'

class ServerDataAcquisitor {
  constructor(){
    window.popsicle = popsicle
  }

  getArtists(dispatch){
    popsicle.get('/artists.json')
      .then(function (res) {
        JSON.parse(res.body).forEach(artist => {
          dispatch(actions.addArtist(artist))
        })
      })
  }

  getArtist(id, dispatch){
    popsicle.get('/artist/' + id + '.json')
      .then(function (res) {
        dispatch(actions.addArtist(JSON.parse(res.body)))
      })
  }

  getAlbums(dispatch){
    popsicle.get('/albums.json')
      .then(function (res) {
        JSON.parse(res.body).forEach(album => {
          dispatch(actions.addAlbum(album))
        })
      })
  }

  getArtistAlbums(artistId, dispatch){
    popsicle.get('/artist/' + artistId + '/albums.json')
      .then(function (res) {
        JSON.parse(res.body).forEach(album => {
          dispatch(actions.addAlbum(album))
        })
      })
  }

  getAlbum(id, dispatch){
    popsicle.get('/album/' + id + '.json')
      .then(function (res) {
        dispatch(actions.addAlbum(JSON.parse(res.body)))
      })
  }

  getAlbumSongs(albumId, dispatch){
    popsicle.get('/album/' + albumId + '/songs.json')
      .then(function (res) {
        JSON.parse(res.body).forEach(song => {
          dispatch(actions.addSong(song))
        })
      })
  }

}

export default ServerDataAcquisitor
