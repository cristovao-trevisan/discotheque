import React from 'react'
import {Page, BottomToolbar, Col, Row} from 'react-onsenui'
import PlayerBar from '../containers/PlayerBar'
import MainContent from '../containers/MainContent'
import Toolbar from './Toolbar'
import Sider from '../containers/Sider'
// console.log(Page, Button)

const bottom = () => (
  <BottomToolbar>
    <PlayerBar />
  </BottomToolbar>
)

const App = () => (
  <Page renderToolbar={Toolbar} renderBottomToolbar={bottom}>
    <Row style={{width: '100%', height: '100%'}}>
      <Col width='15%' style={{backgroundColor: '#574A3D', height: '100%', borderRight: '2px solid rgba(0, 0, 0, .2)'}}>
        <Sider />
      </Col>
      <Col width='85%' style={{backgroundColor: '#DED6CA', height: '100%'}}>
        <MainContent />
      </Col>
    </Row>
  </Page>
)

export default App
