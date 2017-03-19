import React, { PropTypes } from 'react'
import { Row, Col, Icon } from 'antd'
import PlayerTimeline from './PlayerTimeline'


const PlayerBar = ({song, playlistId, time, isPlaying, timerIsRemaining, onTimeClick, onPreviousClick, onNextClick, onPlaylistCLick, onPlayClick, onTimerChange}) => (
  <Row>
    <Col span={1}>Image</Col>
    <Col span={1} onClick={onPreviousClick}><Icon type="step-backward" /></Col>
    <Col span={1} onClick={onPlayClick}>{
      isPlaying ?
        <Icon type="play-circle" /> :
        <Icon type="play-circle-o" />
    }</Col>
    <Col span={1} onClick={onNextClick}><Icon type="step-forward" /></Col>
    <Col span={1}><Icon type="bars" /></Col>
    <Col span={16} offset={1}>
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
