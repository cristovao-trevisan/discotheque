import React, { PropTypes } from 'react'
import {Row, Col, Icon} from 'react-onsenui'
import PlayerTimeline from './PlayerTimeline'

const PlayerBar = ({song, playlistId, time, isPlaying, timerIsRemaining, onTimeClick, onPreviousClick, onNextClick, onPlaylistCLick, onPlayClick, onTimerChange}) => (
  <Row>
    <Col width='10%'>Image</Col>
    <Col width='5%' onClick={onPreviousClick}><Icon size={40} icon='md-skip-previous' /></Col>
    <Col width='5%' onClick={onPlayClick}>{
      isPlaying ?
        <Icon size={40}  icon='md-pause'/>
      :
        <Icon size={40} icon='md-play'/>
    }</Col>
    <Col width='5%' onClick={onNextClick}><Icon size={40} icon='md-skip-next' /></Col>
    <Col width='5%'><Icon size={34} style={{marginTop: '3px'}} icon='md-playlist-audio' /></Col>
    <Col width='2%' />
    <Col width='60%'>
      <PlayerTimeline
        songTitle={song && song.title}
        time={time}
        duration={song && song.duration}
        timerIsRemaining={timerIsRemaining}
        onTimerChange={onTimerChange}
        onTimeClick={onTimeClick}
      />
    </Col>
  </Row>
)

PlayerBar.propTypes = {
  song: PropTypes.shape({
    id: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }),
  playlistId: PropTypes.string,
  time: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  timerIsRemaining: PropTypes.bool.isRequired,
  onTimeClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onPlaylistCLick: PropTypes.func.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onTimerChange: PropTypes.func.isRequired
}

export default PlayerBar
