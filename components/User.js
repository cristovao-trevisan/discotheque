import React from 'react'

const User = () => {
  return (
    <div style={{height: '100%', width: '100%'}}>
      <img src={window.user.picture} className={'avatar'} />
      <div style={{textAlign: 'center'}}>{window.user.name}</div>
    </div>
  )
}

export default User
