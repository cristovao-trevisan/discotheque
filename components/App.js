import React from 'react'
import { Layout } from 'antd'
const { Header: AntHeader, Footer, Sider: AntSider, Content } = Layout;
import PlayerBar from '../containers/PlayerBar'
import MainContent from '../containers/MainContent'
import Header from './Header'
import Sider from './Sider'

const App = () => (
  <Layout>
    <AntHeader>
      <Header />
    </AntHeader>
    <Layout>
      <AntSider>
        <Sider />
      </AntSider>
      <Content>
        <MainContent />
      </Content>
    </Layout>
    <Footer style={{backgroundColor: '#ff9900', padding: '0.5%'}}>
      <PlayerBar />
    </Footer>
  </Layout>
)

export default App
