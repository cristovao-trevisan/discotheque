import reducer, {initialState} from './player'
import * as types from '../constants/ActionTypes'


const playlist = [
  {id: 0, title: 'Yesterday', duration: 144, albumId: 0},
  {id: 10344, title: 'Highway to Hell', duration: 208, albumId: 1},
  {id: 5, title: 'Help!', duration: 141, albumId: 0}
]

const song = {id: 10344, title: 'Highway to Hell', duration: 208, albumId: 1}
const otherSong = {id: 1234, title: 'Money', duration: 383, albumId: 165}

describe('player reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle PLAY_PLAYLIST', () => {
    expect(
      reducer(initialState, {
        type: types.PLAY_PLAYLIST,
        playlist
      })
    ).toEqual(
      {
        ...initialState,
        playlist,
        song: playlist[0],
        time: 0,
        isPlaying: true
      }
    )
  })

  it('should handle PLAY_SONG if song in playlist', () => {
    expect(
      reducer({...initialState, playlist}, {
        type: types.PLAY_SONG,
        song
      })
    ).toEqual(
      {
        ...initialState,
        playlist,
        song,
        time: 0,
        isPlaying: true
      }
    )
  })

  it('should NOT handle PLAY_SONG if song is not in playlist', () => {
    expect(
      reducer({...initialState, playlist}, {
        type: types.PLAY_SONG,
        song: otherSong
      })
    ).toEqual({...initialState, playlist})
  })

  it('should handle PLAY_TIME', () => {
    let time = song.duration - 10
    expect(
      reducer({...initialState, playlist, song}, {
        type: types.PLAY_TIME,
        time
      })
    ).toEqual({
      ...initialState,
      playlist,
      song,
      time
    })
  })

  it('should NOT handle PLAY_TIME out of bounds', () => {
    let time = song.duration + 1
    expect(
      reducer({...initialState, playlist, song}, {
        type: types.PLAY_TIME,
        time
      })
    ).toEqual({...initialState, playlist, song})

    time = -1
    expect(
      reducer({...initialState, playlist, song}, {
        type: types.PLAY_TIME,
        time
      })
    ).toEqual({...initialState, playlist, song})
  })

  it('should handle PLAYER_TOGGLE_TIMER_IS_REMAINING', () => {
    let time = song.duration - 10
    expect(
      reducer(undefined, {
        type: types.PLAYER_TOGGLE_TIMER_IS_REMAINING
      })
    ).toEqual({
      ...initialState,
      timerIsRemaining: true
    })
  })

  it('should handle PLAY_TOGGLE', () => {
    let time = song.duration - 10
    let state = initialState
    state = reducer(state, {type: types.PLAY_TOGGLE})
    expect(
      state
    ).toEqual({
      ...initialState,
      isPlaying: true
    })
    state = reducer(state, {type: types.PLAY_TOGGLE})
    expect(
      state
    ).toEqual({
      ...initialState,
      isPlaying: false
    })
  })

})
