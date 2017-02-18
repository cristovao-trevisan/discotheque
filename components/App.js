import React, { PropTypes } from 'react'
import { Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout;
import PlayerBar from '../containers/PlayerBar'

const App = () => (
  <Layout>
    <Header>header</Header>
    <Layout>
      <Sider>Sider</Sider>
      <Content>Content</Content>
    </Layout>
    <Footer style={{backgroundColor: '#ff9900', padding: '0.5%'}}>
      <PlayerBar />
    </Footer>
  </Layout>
)

export default App
