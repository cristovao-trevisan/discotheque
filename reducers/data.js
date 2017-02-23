import {ADD_ARTIST, ADD_SONG, ADD_ALBUM, ADD_PLAYLIST} from '../constants/ActionTypes'

export const initialState = {
  artists: {},
  albums: {},
  songs: {},
  playlists: {}
}

const data = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTIST:
      var artist = {...action.artist}
      if(action.artist.albums === undefined)
        artist.albums = []
      return {
        ...state,
        artists: {
          ...state.artists,
          [artist.id]: artist
        }
      }
      break;
    case ADD_ALBUM:
      var artist = state.artists[action.album.artistId]
      if(artist === undefined) return state
      var album = {...action.album}
      console.log(album)
      if(action.album.songs === undefined)
        album.songs = []
      console.log(artist)
      return {
        ...state,
        albums: {
          ...state.albums,
          [album.id]: album
        },
        artists: {
          ...state.artists,
          [artist.id]: {
            ...artist,
            albums: [
              ...artist.albums,
              album.id
            ]
          }
        }
      }
      break;
    case ADD_SONG:
      let album = state.albums[action.song.albumId]
      if(album === undefined) return state
      return {
        ...state,
        songs: {
          ...state.songs,
          [action.song.id]: action.song
        },
        albums: {
          ...state.albums,
          [album.id]: {
            ...album,
            songs: [
              ...album.songs,
              action.song.id
            ]
          }
        }
      }
      break;
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.playlist.id]: action.playlist
        }
      }
      break;
    default:
      return state
  }
}

export default data