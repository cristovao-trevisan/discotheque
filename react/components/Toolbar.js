import React from 'react'
import {Toolbar as OnsenToolbar} from 'react-onsenui'
import ToolbarMenu from './ToolbarMenu'

const Toolbar = () => {

  return (
    <OnsenToolbar>
      <div className='left' style={{paddingLeft: '10px'}}>
        <a href='/'>
          <img src={require('../assets/img/icon.png')} style={{height: '80%', width: 'auto', verticalAlign: 'middle', paddingRight: '2px'}} />
        </a>
        Musicoteca
      </div>
      <div className='right' style={{paddingRight: '10px'}}>
        <ToolbarMenu />
      </div>
    </OnsenToolbar>
  )
}

export default Toolbar
