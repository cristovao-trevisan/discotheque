import React, { PropTypes } from 'react'
import PictureListItem from './PictureListItem'
import {Row, Col} from 'react-onsenui'
import {PICTURE_MAX_SIZE_PX} from '../constants'

/**
  This component lists items with a picture and a legend (text prop)
  It resizes itself depending on the available space
*/
class PictureList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      picture: PropTypes.string,
      text: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })).isRequired,
    onItemClick: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)

    this.state = {itemsPerRow: 6, rowsPerPage: 4}

    this.updateDimensions = ::this.updateDimensions
    this.updateItems = ::this.updateItems
  }

  updateItems({items, onItemClick}) {
    var itemComponents = items.map(item =>
      <Col width={100/this.state.itemsPerRow + '%'} style={{height: '100%'}} key={item.id}>
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
        <Row key={i} style={{width: '100%', height: 100/this.state.rowsPerPage+'%'}}>
          { itemComponents.slice(i*this.state.itemsPerRow, (i+1)*this.state.itemsPerRow) }
        </Row>
      )
    }
  }

  updateDimensions() {
    let { clientWidth, clientHeight } = this.refs.pictureListContainer
    let itemsPerRow =  Math.max(Math.floor(clientWidth/PICTURE_MAX_SIZE_PX), 1)
    let rowsPerPage = Math.max(Math.floor(clientHeight/PICTURE_MAX_SIZE_PX), 1)
    console.log(clientHeight, rowsPerPage)
    this.setState({itemsPerRow, rowsPerPage})
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
      <div ref='pictureListContainer' style={{width: '100%', height: '100%'}}>
        <div style={{height: '15%', width: '100%', display: 'table'}}>
          <span style={{padding: '2%', fontSize: 'xx-large', display: 'table-cell', verticalAlign: 'middle'}}>
            {this.props.title}
          </span>
        </div>
        <div style={{height: '85%', width: '100%'}}>
          {this.rows}
        </div>
      </div>
    )
  }
}
// <span style={{fontSize:'small'}}>
//   {this.props.description}
// </span>

export default PictureList
