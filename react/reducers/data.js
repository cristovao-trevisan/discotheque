import {ADD_ARTIST, ADD_SONG, ADD_ALBUM, ADD_PLAYLIST, ADD_PICTURE, ADD_ALBUM_PICTURE, ADD_ARTIST_PICTURE} from '../constants/ActionTypes'

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
      if(state.artists[artist.id]) return state
      if(action.artist.albums === undefined)
        artist.albums = []
      return {
        ...state,
        artists: {
          ...state.artists,
          [artist.id]: artist
        }
      }
      break
    case ADD_ALBUM:
      var artist = state.artists[action.album.artistId]
      var album = {...action.album}
      if(state.albums[album.id]) return state
      if(action.album.songs === undefined)
      album.songs = []
      if(artist === undefined) {
        return {
          ...state,
          albums: {
            ...state.albums,
            [album.id]: album
          }
        }
      }
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
      break
    case ADD_SONG:
      let album = state.albums[action.song.albumId]
      if(album === undefined){
        return {
         ...state,
         songs: {
           ...state.songs,
           [action.song.id]: action.song
         }
       }
      }
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
      break
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.playlist.id]: action.playlist
        }
      }
      break
    case ADD_ARTIST_PICTURE:
      return {
        ...state,
        artists: {
          ...state.artists,
          [action.id]: {
            ...state.artists[action.id],
            picture: action.picture
          }
        }
      }
      break
    case ADD_ALBUM_PICTURE:
      return {
        ...state,
        albums: {
          ...state.albums,
          [action.id]: {
            ...state.albums[action.id],
            picture: action.picture
          }
        }
      }
      break
    default:
      return state
  }
}

export default data
