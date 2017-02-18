import * as types from '../constants/ActionTypes'

/** @param {Array} playlist List of songs */
export const playPlaylist = playlist => ({type: types.PLAY_PLAYLIST, playlist})

/** @param {Object} song */
export const playSong = song => ({type: types.PLAY_SONG, song})

/** @param {number} time */
export const playTime = time => ({type: types.PLAY_TIME, time})

/** @constant - This gives a constan action (not a function, since it does not need any parameters)*/
export const toggleTimerIsRemaining = {type: types.PLAYER_TOGGLE_TIMER_IS_REMAINING}

/** @constant - This gives a constan action (not a function, since it does not need any parameters)*/
export const playToggle = {type: types.PLAY_TOGGLE}
