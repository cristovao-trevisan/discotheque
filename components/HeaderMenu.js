import React, { PropTypes } from 'react'
import { Menu, Dropdown, Icon } from 'antd'
import MoreVertIcon from 'react-icons/lib/md/more-vert'

const menu = (
  <Menu>
    <Menu.Item key='0'>
      <a href="/logout">Logout</a>
    </Menu.Item>
  </Menu>
)

const HeaderMenu = () => {

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <MoreVertIcon />
    </Dropdown>
  )
}

export default HeaderMenu
