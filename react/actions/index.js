import * as types from '../constants/ActionTypes'

// PLAYER ACTIONS
/** @param {Array} playlist List of songs */
export const playPlaylist = playlist => ({type: types.PLAY_PLAYLIST, playlist})

/** @param {Object} song */
export const playSong = song => ({type: types.PLAY_SONG, song})

/** @param {number} time */
export const playTime = time => ({type: types.PLAY_TIME, time})

/** @constant - This gives a constant action (not a function, since it does not need any parameters)*/
export const toggleTimerIsRemaining = {type: types.PLAYER_TOGGLE_TIMER_IS_REMAINING}

/** @constant - This gives a constant action (not a function, since it does not need any parameters)*/
export const playToggle = {type: types.PLAY_TOGGLE}

/** @constant - This gives a constant action (not a function, since it does not need any parameters)*/
export const playerNext = {type: types.PLAYER_NEXT}

/** @constant - This gives a constant action (not a function, since it does not need any parameters)*/
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

/**
 * @param {number} id Album id
 * @param {string} picture Base 64 string
*/
export const addAlbumPicture = (id, picture) => ({type: types.ADD_ALBUM_PICTURE, id, picture})

/**
 * @param {number} id Artist id
 * @param {string} picture Base 64 string
*/
export const addArtistPicture = (id, picture) => ({type: types.ADD_ARTIST_PICTURE, id, picture})

export const setInfo = (key, value) => (dispatch, getState, { serverDataAcquisitor }) => {
  if(key === 'location'){
    if(/^\/albums$/.test(value)){
      serverDataAcquisitor.getTopic('albums')
    }
    else if(/^\/artist\/[0-9]+/.test(value)){
      var id = value.substr(value.lastIndexOf('/')+1)
      serverDataAcquisitor.getTopic('artist', id)
    }
    else if(/^\/album\/[0-9]+/.test(value)){
      var id = value.substr(value.lastIndexOf('/')+1)
      serverDataAcquisitor.getTopic('artists')
      serverDataAcquisitor.getTopic('album', id)
      serverDataAcquisitor.getTopic('songs', id)
    }
    else{
      serverDataAcquisitor.getTopic('artists')
    }
  }
  dispatch({type: types.SET_INFO, key, value})
}
