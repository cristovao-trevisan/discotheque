import reducer, {initialState} from './data'
import * as types from '../constants/ActionTypes'

const artist = {
  id: 1,
  name: 'The Beatles',
  description: 'Rock Band',
  albums: []
}

const album = {
  id: 1,
  title: 'Help!',
  artistId: 1,
  description: 'Only the best songs',
  songs: []
}

const song = {
  id: 5,
  title: 'Help!',
  duration: 141,
  albumId: 1
}

const playlist = {
  id: 0,
  songs: [
    0, 1, 2
  ]
}

describe('data reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle ADD_ARTIST', () => {
    expect(
      reducer(initialState, {
        type: types.ADD_ARTIST,
        artist
      }).artists
    ).toEqual(
      {
        [artist.id]: artist
      }
    )
  })

  it('should handle ADD_ALBUM', () => {
    var init = reducer(initialState, {type: types.ADD_ARTIST, artist})
    expect(
      reducer(init, {
        type: types.ADD_ALBUM,
        album
      }).albums
    ).toEqual(
      {
        [album.id]: album
      }
    )
  })

  it('should handle ADD_SONG', () => {
    var init = reducer(initialState, {type: types.ADD_ARTIST, artist})
    init = reducer(init, {type: types.ADD_ALBUM, album})
    expect(
      reducer(init, {
        type: types.ADD_SONG,
        song
      }).songs
    ).toEqual(
      {
        [song.id]: song
      }
    )
  })

  it('should handle ADD_PLAYLIST', () => {
    expect(
      reducer(initialState, {
        type: types.ADD_PLAYLIST,
        playlist
      }).playlists
    ).toEqual(
      {
        [playlist.id]: playlist
      }
    )
  })

  it('should handle ADD_ALBUM_PICTURE', () => {
    var init = reducer(initialState, {type: types.ADD_ARTIST, artist})
    init = reducer(init, {type: types.ADD_ALBUM, album})
    expect(
      reducer(init, {
        type: types.ADD_ALBUM_PICTURE,
        id: 1,
        picture: 'picture data'
      }).albums
    ).toEqual(
      {
        [album.id]: {
          ...album,
          picture: 'picture data'
        }
      }
    )
  })

  it('should handle ADD_ARTIST_PICTURE', () => {
    var init = reducer(initialState, {type: types.ADD_ARTIST, artist})
    expect(
      reducer(init, {
        type: types.ADD_ARTIST_PICTURE,
        id: 1,
        picture: 'picture data'
      }).artists
    ).toEqual(
      {
        [artist.id]: {
          ...artist,
          picture: 'picture data'
        }
      }
    )
  })
})
