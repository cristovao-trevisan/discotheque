import { combineReducers } from 'redux'
import player from './player'
import data from './data'

export default combineReducers({
  player,
  data
})
