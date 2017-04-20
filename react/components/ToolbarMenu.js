import React, { PropTypes } from 'react'
import {Icon} from 'react-onsenui'
import DropdownMenu from './DropdownMenu'

const menuItems = [
  (
    <a
    style={{
        color: 'inherit',
        textDecoration: 'none'
      }}
    href='/logout'>
      Logout
    </a>
  )
]

const ToolbarMenu = () => (
  <div>
    <DropdownMenu
      items={menuItems}
      >
      <Icon icon='md-menu' />
    </DropdownMenu>
  </div>
)

export default ToolbarMenu
