import {PLAY_PLAYLIST, PLAY_SONG, PLAY_TIME, PLAYER_TOGGLE_TIMER_IS_REMAINING, PLAY_TOGGLE} from '../constants/ActionTypes'

export const initialState = {
  playlist: [],
  song: null,
  time: 0,
  timerIsRemaining: false,
  isPlaying: false
}

const player = (state = initialState, action) => {
  switch (action.type) {
    case PLAY_PLAYLIST:
      return {
        ...state,
        playlist: action.playlist,
        song: action.playlist[0],
        time: 0,
        isPlaying: true
      }
    case PLAY_SONG:
      if(state.playlist.find(song => song.id === action.song.id))
        return {
          ...state,
          song: action.song,
          time: 0,
          isPlaying: true
        }
      else
        return state
    case PLAY_TIME:
      if(action.time >=0 && state.song && action.time <= state.song.duration)
        return {...state, time: action.time}
      else
        return state
    case PLAYER_TOGGLE_TIMER_IS_REMAINING:
      return {...state, timerIsRemaining: !state.timerIsRemaining}
    case PLAY_TOGGLE:
      return {...state, isPlaying: !state.isPlaying}
    default:
      return state
  }
}

export default player
