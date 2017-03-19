import React, { PropTypes } from 'react'
import PictureListItem from './PictureListItem'
import { Row, Col } from 'antd'
import { PICTURE_MAX_SIZE_PX } from '../constants'

/**
  This component lists items with a picture and a legend (text prop)
  It resizes itself depending on the available space
*/
class PictureList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      picture: PropTypes.string,
      text: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })).isRequired,
    onItemClick: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)

    this.state = {itemsPerRow: 6}

    this.updateDimensions = this.updateDimensions.bind(this)
    this.updateItems = this.updateItems.bind(this)
  }

  updateItems({items, onItemClick}) {
    var itemComponents = items.map(item =>
      <Col span={Math.floor(24/this.state.itemsPerRow)} key={item.id}>
        <PictureListItem
          picture={item.picture}
          id={item.id}
          text={item.text}
          onItemClick={onItemClick}
        />
      </Col>
    )

    this.rows = []

    var idx = 0
    for(let i=0; i<=items.length/this.state.itemsPerRow; i++){
      this.rows.push(
        <Row key={i}>
          { itemComponents.slice(i*this.state.itemsPerRow, (i+1)*this.state.itemsPerRow) }
        </Row>
      )
    }
  }

  updateDimensions() {
    let { clientWidth } = this.refs.pictureListContainer
    let itemsPerRow =  Math.max(Math.floor(clientWidth/PICTURE_MAX_SIZE_PX), 1)
    this.setState({itemsPerRow})
  }

  componentWillReceiveProps(nextProps){
    this.updateItems(nextProps)
  }

  componentWillUpdate(nextProps){
    this.updateItems(nextProps)
  }

  componentDidMount(){
    window.addEventListener('resize', this.updateDimensions)
    this.updateDimensions()
  }

  componentWillUnMount(){
    window.removeEventListener('resize', this.updateDimensions)
  }

  render(){
    return (
      <div ref='pictureListContainer'>
        <h1 style={{padding: '1%'}}>{this.props.title}</h1>
        <div>
          {this.rows}
        </div>
      </div>
    )
  }
}

export default PictureList
