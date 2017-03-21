import * as actions from './index.js'
import * as types from '../constants/ActionTypes'

const playlist = [
  {id: 0, title: 'Yesterday', duration: 144, albumId: 0},
  {id: 10344, title: 'Highway to Hell', duration: 208, albumId: 1},
  {id: 5, title: 'Help!', duration: 141, albumId: 0}
]

const song = {id: 10344, title: 'Highway to Hell', duration: 208, albumId: 1}
const otherSong = {id: 1234, title: 'Money', duration: 383, albumId: 165}


describe('player actions', () => {
  it('should create an action to play a playlist', () => {
    const expectedAction = {
      type: types.PLAY_PLAYLIST,
      playlist
    }
    expect(actions.playPlaylist(playlist)).toEqual(expectedAction)
  })

  it('should create an action to play a song', () => {
    const expectedAction = {
      type: types.PLAY_SONG,
      song
    }
    expect(actions.playSong(song)).toEqual(expectedAction)
  })

  it('should create an action to set the song time', () => {
    const time = 123
    const expectedAction = {
      type: types.PLAY_TIME,
      time
    }
    expect(actions.playTime(time)).toEqual(expectedAction)
  })

  it('should create an action to chose the timer type (remaining or not)', () => {
    const isRemaining = true
    const expectedAction = {
      type: types.PLAYER_TOGGLE_TIMER_IS_REMAINING,
    }
    expect(actions.toggleTimerIsRemaining).toEqual(expectedAction)
  })

  it('should be an action to toggle the playing status (play/pause)', () => {
    const expectedAction = {
      type: types.PLAY_TOGGLE,
    }
    expect(actions.playToggle).toEqual(expectedAction)
  })

  it('should create an action to set the next song', () => {
    const expectedAction = {
      type: types.PLAYER_NEXT
    }
    expect(actions.playerNext).toEqual(expectedAction)
  })

  it('should create an action to restart/go back a song', () => {
    const expectedAction = {
      type: types.PLAYER_BACK
    }
    expect(actions.playerBack).toEqual(expectedAction)
  })
})
