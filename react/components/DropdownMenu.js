import React, { PropTypes } from 'react'
import {Popover, List, ListItem} from 'react-onsenui'

class DropdownMenu extends React.Component{
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.element).isRequired
  }

  state = {
    isOpen: false,
  }

  hide(){
    this.setState({isOpen: false})
  }

  show(){
    this.setState({isOpen: true})
  }

  toggle(){
    this.setState({isOpen: !this.state.isOpen})
  }

  renderItem(item, index){
    return (
      <ListItem key={index}>
        {item}
      </ListItem>
    )
  }

  render(){
    var self = this
    var target = React.cloneElement(
      React.Children.only(this.props.children),
      {onClick: ::self.toggle, ref: 'target'}
    )

    return (
      <div>
        {target}
        <Popover
          isOpen={this.state.isOpen}
          onOpen={this.show}
          onHide={this.hide}
          isCancelable={true}
          getTarget={() => this.refs.target}
        >
          <div style={{paddingRight: '10px'}}>
            <List
              modifier='noborder'
              dataSource={this.props.items}
              renderRow={this.renderItem}
            />
          </div>
        </Popover>
      </div>
    )
  }
}

export default DropdownMenu
