import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Icon } from 'antd'
import PlayerTimeline from '../components/PlayerTimeline'
import * as actions from '../actions'

let PlayerBar = ({song, playlistId, time, isPlaying, timerIsRemaining, onTimeClick, onPreviousClick, onNextClick, onPlaylistCLick, onPlayClick, onTimerChange}) => (
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
  playlistId: PropTypes.number,
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


const mapStateToProps = (state, ownProps) => ({
  song: state.player.song,
  time: state.player.time,
  isPlaying: state.player.isPlaying,
  timerIsRemaining: state.player.timerIsRemaining,
  playlistId: state.player.playlist.id
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPreviousClick: () => {
    dispatch(actions.playerBack)
  },
  onNextClick: () => {
    dispatch(actions.playerNext)
  },
  onPlaylistCLick: () => {

  },
  onPlayClick: () => {
    dispatch(actions.playToggle)
  },
  onTimerChange: (time) => {
    if(time != null)
      dispatch(actions.playTime(time))
  },
  onTimeClick: () => {
    dispatch(actions.toggleTimerIsRemaining)
  }
})

PlayerBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerBar)

export default PlayerBar
