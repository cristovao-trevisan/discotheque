import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createEpicMiddleware } from 'redux-observable'
import App from './components/App'
import reducer from './reducers'
import './reactIndex.css'
import { rootEpic } from './epics'
import Player from './modules/Player'
import ServerDataAcquisitor from './modules/ServerDataAcquisitor'

console.log(rootEpic)

window.Player = Player


const epicMiddleware = createEpicMiddleware(rootEpic);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(epicMiddleware)))

window.serverDataAcquisitor = new ServerDataAcquisitor(store)

window.player = new Player(store)


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
