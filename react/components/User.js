import React from 'react'

const avatar ={
  width: '30%',
  borderRadius: '50%',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block'
}

const User = () => {
  var picture = window.user && window.user.picture || require('../assets/img/unknown-user.jpg')
  var name = window.user && window.user.name || 'Batman'
  return (
    <div>
      <img src={picture} style={avatar} />
      <div style={{textAlign: 'center'}}>{name}</div>
    </div>
  )
}

export default User
