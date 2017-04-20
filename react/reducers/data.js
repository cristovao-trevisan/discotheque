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
      let artist = {...action.artist}
      if (state.artists[artist.id]) return state
      if (action.artist.albums === undefined) { artist.albums = [] }
      return {
        ...state,
        artists: {
          ...state.artists,
          [artist.id]: artist
        }
      }
    case ADD_ALBUM:
      artist = state.artists[action.album.artistId]
      let album = {...action.album}
      if (state.albums[album.id]) return state
      if (action.album.songs === undefined) { album.songs = [] }
      if (artist === undefined) {
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
    case ADD_SONG:
      album = state.albums[action.song.albumId]
      if (album === undefined) {
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
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.playlist.id]: action.playlist
        }
      }
    default:
      return state
  }
}

export default data
