import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createEpicMiddleware } from 'redux-observable'
import thunk from 'redux-thunk'
import App from './components/App'
import reducer from './reducers'
import './reactIndex.css'
import { rootEpic } from './epics'
import Player from './modules/Player'
import ServerDataAcquisitor from './modules/ServerDataAcquisitor'
import {setInfo} from './actions'
import ons from 'onsenui'
require('onsenui/css/onsenui.css')
require('./assets/css/onsen-css-components.css')

const epicMiddleware = createEpicMiddleware(rootEpic);
ons.forcePlatformStyling('android')

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const serverDataAcquisitor = new ServerDataAcquisitor()

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk.withExtraArgument({serverDataAcquisitor}))))

window.player = new Player(store)
window.Player = Player

store.dispatch(setInfo('location', window.location.pathname))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
