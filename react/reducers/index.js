import { combineReducers } from 'redux'
import player from './player'
import data from './data'
import info from './info'

export default combineReducers({
  player,
  data,
  info
})
