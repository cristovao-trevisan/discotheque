import React, { PropTypes } from 'react'
import { Slider } from 'antd'

const zeroPad = (num, places) => {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

const formatTime = (time) => parseInt(time/60)+':'+zeroPad(time%60, 2)

const PlayerTimeline = ({ songTitle, time, duration, timerIsRemaining, onTimerChange, onTimeClick }) => {
  let showingTitle = songTitle === null ? '---' : songTitle

  let sliderValue = time/duration * 100
  if(isNaN(sliderValue)) sliderValue = 0

  let showingTimer = timerIsRemaining ?
    '-' + formatTime(duration-time) :
    formatTime(time) + '/' + formatTime(duration)

  return (
    <div>
      <p style={{textAlign: 'center', color: 'white'}}> {showingTitle} </p>
      <Slider tipFormatter={formatTime} defaultValue={time} max={duration} onAfterChange={onTimerChange} />
      <p style={{textAlign: 'right', color: 'white'}} onClick={onTimeClick}> {showingTimer}</p>
    </div>
  )
}

export default PlayerTimeline
