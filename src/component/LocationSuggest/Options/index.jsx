import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import './index.scss'

class Options extends React.Component {
  handleClick = e => {
    const id = e.currentTarget.id.replace('options-', '')
    let option = []

    this.props.options.forEach(o => {
      if (o.id === id) {
        option = o
      }
    })

    this.props.onChange(option)
  }

  render() {
    const { handleClick } = this
    const { options } = this.props

    return (
      <div className="Options">
        <List className="Options__list">
          {options.map(option => (
            <ListItem
              className="Options__item"
              id={`options-${option.id}`}
              key={`options-${option.id}`}
              onClick={handleClick}
            >
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary={option.location} />
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string,
      id: PropTypes.string,
      position: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }),
  ).isRequired,
}

export default Options
