import {SET_INFO, REMOVE_INFO} from '../constants/ActionTypes'
import {filterObject} from '../helpers'
export const initialState = {
}

const data = (state = initialState, action) => {
  switch (action.type) {
    case SET_INFO:
      return {
        ...state,
        [action.key]: action.value
      }
    case REMOVE_INFO:
      return filterObject(state, (value, key) => key !== action.key)
    default:
      return state
  }
}

export default data
