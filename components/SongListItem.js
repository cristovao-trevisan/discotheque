import React, { PropTypes } from 'react'
import { Row, Col } from 'antd'
import { formatTime } from '../helpers'

const SongListItem = ({title, songId, artist, artistId, album, albumId, duration, onPlayClick, onArtistClick, onAlbumClick}) => {

  return (
    <Row>
      <Col span={6} onClick={() => onPlayClick(songId)} >{title}</Col>
      <Col span={6} onClick={() => onArtistClick(artistId)} >{artist}</Col>
      <Col span={6} onClick={() => onAlbumClick(albumId)} >{album}</Col>
      <Col span={6} >{formatTime(duration)}</Col>
    </Row>
  )
}

SongListItem.propTypes = {
  title: PropTypes.string.isRequired,
  songId: PropTypes.number.isRequired,
  artist: PropTypes.string.isRequired,
  artistId: PropTypes.number.isRequired,
  album: PropTypes.string.isRequired,
  albumId: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onArtistClick: PropTypes.func.isRequired,
  onAlbumClick: PropTypes.func.isRequired
}

export default SongListItem
