import React from 'react'
import { connect } from 'react-redux'
import ReactList from 'react-list'
import PictureList from '../components/PictureList'
import SongListItem from '../components/SongListItem'
import { convertToItems, convertToArray, filterObject } from '../helpers'
import {playPlaylist, playSong} from '../actions'

class MainContent extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      path: window.location.pathname
    }

    window.onpopstate = this.onLocationChange.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setArtist = this.setArtist.bind(this)
  }

  onLocationChange(){
    this.setState({
      path: window.location.pathname
    })
  }

  setLocation(location){
    window.history.pushState(['next'], '', location)
    this.setState({
      path: location
    })
  }

  setArtist(id){
    window.serverDataAcquisitor.getTopic('albums', id)
    this.setLocation('/artist/'+id)
  }

  setAlbum(id){
    window.serverDataAcquisitor.getTopic('songs', id)
    this.setLocation('/album/'+id)
  }

  render(){
    if(/^\/albums$/.test(this.state.path)){
      var items = convertToItems(this.props.albums, {id: 'id', picture: 'picture', title: 'text'})
      return (
        <PictureList
          title='Albums'
          items={items}
          onItemClick={id => this.setAlbum(id)}
        />
      )
    }
    else if(/^\/artist\/[0-9]+/.test(this.state.path)){
      var id = this.state.path.substr(this.state.path.lastIndexOf('/')+1)
      var artist = this.props.artists[id]
      if(artist === undefined) return (<div></div>)
      var items = filterObject(this.props.albums, album => album.artistId == id)
      items = convertToItems(items, {id: 'id', picture: 'picture', title: 'text'})
      return (
        <PictureList
          title={artist.name}
          items={items}
          onItemClick={id => this.setAlbum(id)}
        />
      )
    }
    else if(/^\/album\/[0-9]+/.test(this.state.path)){
      var id = parseInt(this.state.path.substr(this.state.path.lastIndexOf('/')+1))
      var album = this.props.albums[id]
      if(album === undefined) return (<div></div>)
      var artist = this.props.artists[album.artistId]
      if(artist === undefined) return (<div></div>)
      var songs = filterObject(this.props.songs, song => song.albumId === id)
      songs = convertToArray(songs)
      var renderItem = (i, key) => (
        <SongListItem
          key = {key}
          title = {songs[i].title}
          songId = {songs[i].id}
          artist = {artist.name}
          artistId = {artist.id}
          album = {album.title}
          albumId = {album.id}
          duration = {songs[i].duration}
          onPlayClick = {() => this.props.play({id: 'album'+album.id, songs}, songs[i])}
          onArtistClick = {() => id => this.setArtist(id)}
          onAlbumClick = {() => {}}
        />
      )
      return (
        <ReactList
          itemRenderer={renderItem}
          length={songs.length}
          type='uniform'
        />
      )
    }
    else{
      var items = convertToItems(this.props.artists, {id: 'id', picture: 'picture', name: 'text'})
      return (
        <PictureList
          title='Artistas'
          items={items}
          onItemClick={id => this.setArtist(id)}
        />
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  albums: state.data.albums,
  artists: state.data.artists,
  songs: state.data.songs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  play: (playlist, song) => {
    dispatch(playPlaylist(playlist))
    dispatch(playSong(song))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContent)
