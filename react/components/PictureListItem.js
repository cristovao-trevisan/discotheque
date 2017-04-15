import React, { PropTypes } from 'react'

const PictureListItem = ({id, text, picture, onItemClick}) => {
  return (
    <div style={{height: '100%', width: '100%', padding: '2%'}}>
      <img src={picture===undefined ? require('../assets/img/unknown.png') : '/' + picture} style={{height: 'auto', width: '95%', margin: 'auto', display: 'block'}} onClick={() => onItemClick(id)} />
      <div style={{textAlign: 'center'}} onClick={() => onItemClick(id)} >{text}</div>
    </div>
  )
}

PictureListItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  picture: PropTypes.string,
  onItemClick: PropTypes.func.isRequired
}

export default PictureListItem
