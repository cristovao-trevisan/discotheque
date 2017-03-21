import React, {PropTypes} from 'react'
import User from '../components/User'
import {setInfo} from '../actions'
import {connect} from 'react-redux'
import {compoundStyles} from '../helpers'

const selectedOption = {
  width: '100%',
  background: '#44392F'
}

class Sider extends React.Component{
  static propTypes = {
    setInfo: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired
  }

  constructor (props){
    super(props)

    this.setLocation = ::this.setLocation
  }

  setLocation(location){
    if(location !== this.props.location){
      window.history.pushState(['next'], '', location)
      this.props.setInfo('location', location)
    }
  }

  render(){
    var self = this
    return (
      <div style={{height: '100%', width: '100%', color: '#DED6CA'}}>
        <div style={{height: '5%'}} />
        <User />
        <hr />
        <div style={compoundStyles({textAlign: 'center'}, this.props.location === '/' ? selectedOption : undefined)}>
          <a href='#' style={{color: 'inherit', textDecoration: 'none'}} onClick={(e) => {
              e.preventDefault()
              self.setLocation('/')
            }}>
            Artistas
          </a>
        </div>
        <div style={compoundStyles({textAlign: 'center'}, this.props.location === '/albums' ? selectedOption : undefined)}>
          <a href='#' style={{color: 'inherit', textDecoration: 'none'}} onClick={(e) => {
              e.preventDefault()
              self.setLocation('/albums')
            }}>
            Álbums
          </a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  location: state.info.location
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setInfo: (key, value) => dispatch(setInfo(key, value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sider)
