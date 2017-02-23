import {PLAY_PLAYLIST, PLAY_SONG, PLAY_TIME, PLAYER_TOGGLE_TIMER_IS_REMAINING, PLAY_TOGGLE, PLAYER_NEXT, PLAYER_BACK} from '../constants/ActionTypes'
import {PLAYER_BACK_REPEAT_TIMEOUT} from '../constants'
export const initialState = {
  playlist: {
    id: null,
    songs: []
  },
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
        song: action.playlist.songs[0],
        time: 0,
        isPlaying: true
      }
    case PLAY_SONG:
      if(state.playlist.songs.find(song => song.id === action.song.id))
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
      if(state.song === null) return state
      return {...state, isPlaying: !state.isPlaying}
    case PLAYER_NEXT:
      if(state.playlist.songs.length>0){
        let idx = state.playlist.songs.indexOf(state.song)
        idx = (idx+1)%state.playlist.songs.length
        if(idx >=0) return {...state, song: state.playlist.songs[idx], time: 0}
      }
      return state
    case PLAYER_BACK:
      if(state.playlist.songs.length>0){
        let idx = state.playlist.songs.indexOf(state.song)
        if(state.time > PLAYER_BACK_REPEAT_TIMEOUT) return {...state, time: 0}
        idx = --idx < 0 ? state.playlist.songs.length-1 : idx
        return {...state, song: state.playlist.songs[idx], time: 0}
      }
      return state
    default:
      return state
  }
}

export default player
