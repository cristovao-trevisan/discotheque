import reducer, {initialState} from './info'
import * as types from '../constants/ActionTypes'

describe('player reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle SET_INFO', () => {
    expect(
      reducer({}, {
        type: types.SET_INFO,
        key: 'a',
        value: 1
      })
    ).toEqual({a: 1})
  })

  it('should handle REMOVE_INFO', () => {
    expect(
      reducer({a: 1}, {
        type: types.REMOVE_INFO,
        key: 'a'
      })
    ).toEqual({})
  })
})
