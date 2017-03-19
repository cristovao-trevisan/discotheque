import React, { PropTypes } from 'react'
import { Slider } from 'antd'
import { formatTime, zeroPad } from '../helpers'

class PlayerTimeline extends React.Component {
  static propTypes = {
    songTitle: PropTypes.string,
    time: PropTypes.number.isRequired,
    timerIsRemaining: PropTypes.bool.isRequired,
    onTimeClick: PropTypes.func.isRequired,
    onTimerChange: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      time: props.time
    }

    this.noUpdate = false
    this.onTimerChange = this.onTimerChange.bind(this)
    this.onTimerAfterChange = this.onTimerAfterChange.bind(this)
  }

  onTimerChange(time){
    this.noUpdate = true
    this.setState({time})
  }

  onTimerAfterChange(time){
    this.noUpdate = false
    this.props.onTimerChange(time)
  }

  componentWillReceiveProps(nextProps){
    if(this.noUpdate) return
    if(nextProps.time != this.state.time)
      this.setState({time: nextProps.time})
  }

  render(){
    let showingTitle = this.props.songTitle === null ? '---' : this.props.songTitle

    let sliderValue = this.props.time/this.props.duration * 100
    if(isNaN(sliderValue)) sliderValue = 0

    let showingTimer = this.props.timerIsRemaining ?
      '-' + formatTime(this.props.duration-this.props.time) :
      formatTime(this.props.time) + '/' + formatTime(this.props.duration)
    return (
      <div>
        <p style={{textAlign: 'center', color: 'white'}}> {showingTitle} </p>
        <Slider tipFormatter={formatTime} value={this.state.time} max={this.props.duration} onAfterChange={this.onTimerAfterChange} onChange={this.onTimerChange} />
        <p style={{textAlign: 'right', color: 'white'}} onClick={this.props.onTimeClick}> {showingTimer}</p>
      </div>
    )
  }
}
export default PlayerTimeline
