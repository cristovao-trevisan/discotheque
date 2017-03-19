import React from 'react'
import HeaderMenu from './HeaderMenu'

const Header = () => {

  return (
    <div style={{height: '100%'}}>
      <img src='/public/img/icon.png' style={{height: '80%', width: 'auto'}} />
      Musicoteca
      <HeaderMenu />
    </div>
  )
}

export default Header
