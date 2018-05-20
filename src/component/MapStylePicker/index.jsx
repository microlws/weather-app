import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import * as mapStyleKeys from 'tools/mapStyles'
import './index.scss'

class MapStylePicker extends React.Component {
  state = {
    open: false,
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { handleToggle } = this
    const { onChange } = this.props

    return (
      <div className="MapStylePicker">
        {this.state.open && (
          <Card className="MapStylePicker__card">
            <List>
              {Object.keys(mapStyleKeys).map(key => (
                <ListItem key={key} onClick={() => onChange(key)}>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                  <ListItemText primary={key} />
                </ListItem>
              ))}
            </List>
          </Card>
        )}
        <IconButton className="MapStylePicker__button" color="primary" size="large" onClick={this.handleToggle}>
          <SettingsIcon />
        </IconButton>
      </div>
    )
  }
}

MapStylePicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MapStylePicker
