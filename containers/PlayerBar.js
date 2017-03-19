import { connect } from 'react-redux'
import * as actions from '../actions'
import PlayerBarComponent from '../components/PlayerBar'

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

const PlayerBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerBarComponent)

export default PlayerBar
