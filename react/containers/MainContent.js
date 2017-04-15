import React from 'react'
import { connect } from 'react-redux'
import {LazyList, Row, Col} from 'react-onsenui'
import PictureList from '../components/PictureList'
import SongListItem from '../components/SongListItem'
import { convertToItems, convertToArray, filterObject } from '../helpers'
import {playPlaylist, playSong, setInfo} from '../actions'

class MainContent extends React.Component {
  constructor(props){
    super(props)

    this.setLocation = this.setLocation.bind(this)
    this.setArtist = this.setArtist.bind(this)
  }

  setLocation(location){
    window.history.pushState(['next'], '', location)
    this.props.setInfo('location', location)
  }

  setArtist(id){
    this.setLocation('/artist/'+id)
  }

  setAlbum(id){
    this.setLocation('/album/'+id)
  }

  render(){
    if(/^\/albums$/.test(this.props.path)){
      var items = convertToItems(this.props.albums, {id: 'id', picturePath: 'picture', title: 'text'})
      return (
        <PictureList
          title='Álbums'
          items={items}
          onItemClick={id => this.setAlbum(id)}
        />
      )
    }
    else if(/^\/artist\/[0-9]+/.test(this.props.path)){
      var id = this.props.path.substr(this.props.path.lastIndexOf('/')+1)
      var artist = this.props.artists[id]
      if(artist === undefined) return (<div></div>)
      var items = filterObject(this.props.albums, album => album.artistId == id)
      items = convertToItems(items, {id: 'id', picturePath: 'picture', title: 'text'})
      return (
        <PictureList
          title={artist.name}
          description={artist.description}
          items={items}
          onItemClick={id => this.setAlbum(id)}
        />
      )
    }
    else if(/^\/album\/[0-9]+/.test(this.props.path)){
      var id = parseInt(this.props.path.substr(this.props.path.lastIndexOf('/')+1))
      var album = this.props.albums[id]
      if(album === undefined) return (<div></div>)
      var artist = this.props.artists[album.artistId]
      if(artist === undefined) return (<div></div>)
      var songs = filterObject(this.props.songs, song => song.albumId === id)
      songs = convertToArray(songs)
      var renderItem = (i) => (
        <SongListItem
          key = {i}
          title = {songs[i].title}
          songId = {songs[i].id}
          artist = {artist.name}
          artistId = {artist.id}
          album = {album.title}
          albumId = {album.id}
          duration = {songs[i].duration}
          selected = {this.props.playingNow && this.props.playingNow.id === songs[i].id}
          onPlayClick = {() => this.props.play({id: 'album'+album.id, songs}, songs[i])}
          onArtistClick = {() => id => this.setArtist(id)}
          onAlbumClick = {() => {}}
        />
      )
      return (
        <div style={{width: '100%', height: '100%'}}>
          <div style={{height: '1%'}} />
          <Row style={{fontWeight: 'bold'}}>
            <Col width='30%'>Título</Col>
            <Col width='30%'>Artista</Col>
            <Col width='30%'>Álbum</Col>
            <Col width='10%'>Duração</Col>
          </Row>
          <LazyList
            length={songs.length}
            renderRow={renderItem}
            calculateItemHeight={() => 30}
          />
        </div>
      )
    }
    else{
      var items = convertToItems(this.props.artists, {id: 'id', picturePath: 'picture', name: 'text'})
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
  songs: state.data.songs,
  playingNow: state.player.song,
  path: state.info.location
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  play: (playlist, song) => {
    dispatch(playPlaylist(playlist))
    dispatch(playSong(song))
  },
  setInfo: (key, value) => {
    dispatch(setInfo(key, value))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContent)
