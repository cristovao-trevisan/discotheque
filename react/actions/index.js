import * as types from '../constants/ActionTypes'

// PLAYER ACTIONS
/** @param {Array} playlist List of songs */
export const playPlaylist = playlist => ({type: types.PLAY_PLAYLIST, playlist})

/** @param {Object} song */
export const playSong = song => ({type: types.PLAY_SONG, song})

/** @param {number} time */
export const playTime = time => ({type: types.PLAY_TIME, time})

/** @constant - This gives a constant action (not a function, since it does not need any parameters) */
export const toggleTimerIsRemaining = {type: types.PLAYER_TOGGLE_TIMER_IS_REMAINING}

/** @constant - This gives a constant action (not a function, since it does not need any parameters) */
export const playToggle = {type: types.PLAY_TOGGLE}

/** @constant - This gives a constant action (not a function, since it does not need any parameters) */
export const playerNext = {type: types.PLAYER_NEXT}

/** @constant - This gives a constant action (not a function, since it does not need any parameters) */
export const playerBack = {type: types.PLAYER_BACK}

// DATA ACTIONS
/** @param {Object} artist */
export const addArtist = artist => ({type: types.ADD_ARTIST, artist})

/** @param {Object} album */
export const addAlbum = album => ({type: types.ADD_ALBUM, album})

/** @param {Object} song */
export const addSong = song => ({type: types.ADD_SONG, song})

/** @param {Object} playlist */
export const addPlaylist = playlist => ({type: types.ADD_PLAYLIST, playlist})

export const setInfo = (key, value) => (dispatch, getState, { serverDataAcquisitor }) => {
  if (key === 'location') {
    if (/^\/albums$/.test(value)) {
      serverDataAcquisitor.getAlbums(dispatch)
    } else if (/^\/artist\/[0-9]+/.test(value)) {
      var artistId = value.substr(value.lastIndexOf('/') + 1)
      serverDataAcquisitor.getArtist(artistId, dispatch)
      serverDataAcquisitor.getArtistAlbums(artistId, dispatch)
    } else if (/^\/album\/[0-9]+/.test(value)) {
      var albumId = value.substr(value.lastIndexOf('/') + 1)
      serverDataAcquisitor.getArtists(dispatch)
      serverDataAcquisitor.getAlbum(albumId, dispatch)
      serverDataAcquisitor.getAlbumSongs(albumId, dispatch)
    } else {
      serverDataAcquisitor.getArtists(dispatch)
    }
  }
  dispatch({type: types.SET_INFO, key, value})
}
