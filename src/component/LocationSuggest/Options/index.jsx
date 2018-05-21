import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import ImageIcon from '@material-ui/icons/Image'
import './index.scss'

class Options extends React.Component {
  constructor(props) {
    super(props)

    this.actionList = {}
    this.lastIndex = -1
  }

  componentDidUpdate() {
    const { selectedIndex } = this.props

    if (selectedIndex && this.props.isSelecting) {
      this.actionList[selectedIndex]()
    } else if (this.actionList[selectedIndex]) {
      this.blurAll()
    }
  }

  componentWillUnmount() {
    this.blurAll()
  }

  blurAll = () => {
    const { actionList } = this

    Object.keys(actionList).forEach(key => {
      actionList[key](false)
    })
  }

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
    const { handleClick, actionList } = this
    const { options } = this.props

    console.log('updating list')

    return (
      <div className="Options">
        <List className="Options__list">
          {options.map(option => (
            <Button
              action={actions => {
                actionList[option.id] = actions.focusVisible
              }}
              className="Options__button"
              id={`options-${option.id}`}
              onClick={handleClick}
              key={`options-${option.id}`}
              fullWidth
            >
              <ListItem className="Options__item">
                <Avatar>
                  <ImageIcon />
                </Avatar>
                <ListItemText primary={option.location} />
              </ListItem>
            </Button>
          ))}
        </List>
      </div>
    )
  }
}

Options.defaultProps = {
  selectedIndex: '',
}

Options.propTypes = {
  isSelecting: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.string,
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
