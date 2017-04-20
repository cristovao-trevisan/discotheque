import React, { PropTypes } from 'react'
import { Row, Col } from 'react-onsenui'
import { formatTime } from '../helpers'

const colStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  marginRight: '1%'
}

const SongListItem = ({title, songId, artist, artistId, album, albumId, duration, onPlayClick, onArtistClick, onAlbumClick, selected}) => {
  return (
    <Row style={selected ? {background: '#b7ad9d'} : {}}>
      <Col width='29%' style={colStyle} onClick={() => onPlayClick(songId)} >{title}</Col>
      <Col width='29%' style={colStyle} onClick={() => onArtistClick(artistId)} >{artist}</Col>
      <Col width='29%' style={colStyle} onClick={() => onAlbumClick(albumId)} >{album}</Col>
      <Col width='9%' style={colStyle} >{formatTime(duration)}</Col>
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
  selected: PropTypes.bool,
  onPlayClick: PropTypes.func.isRequired,
  onArtistClick: PropTypes.func.isRequired,
  onAlbumClick: PropTypes.func.isRequired
}

export default SongListItem
