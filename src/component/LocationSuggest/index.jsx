import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search'
import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import mouseTrap from 'react-mousetrap'
import Options from './Options'
import './index.scss'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

class LocationSuggest extends React.Component {
  state = {
    options: [],
    selectedIndex: -1,
  }

  componentDidMount() {
    this.props.bindShortcut('up', this.goToPrev)
    this.props.bindShortcut('down', this.goToNext)
  }

  timeout = null

  isSelecting = false

  updateOptions = async inputValue => {
    let options = []

    if (inputValue.length > 1) {
      const geolocation = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAP70dQfEIvqOSQ7O8tXMEuErqQsa7V0wE&address=${inputValue}`,
      )

      const { data } = geolocation

      if (data.results) {
        options = data.results.map(result => ({
          location: result.formatted_address,
          id: result.place_id,
          position: result.geometry.location,
        }))
      }

      this.setState({ options })
    } else {
      this.setState({ options: [] })
    }
  }

  handleInputChange = async e => {
    const { updateOptions } = this
    const { value } = e.target

    clearTimeout(this.timeout)
    this.isSelecting = false

    this.timeout = setTimeout(() => {
      updateOptions(value)
    }, 300)
  }

  goToNext = () => {
    const { selectedIndex, options } = this.state
    const checkIndex = selectedIndex + 1
    const option = options[checkIndex]
    const newIndex = option ? checkIndex : -1

    if (this.isSelecting) {
      this.setState({ selectedIndex: newIndex })
    }
  }

  goToPrev = () => {
    const { selectedIndex, options } = this.state
    const checkIndex = selectedIndex - 1
    const option = options[checkIndex]
    const newIndex = option ? checkIndex : -1

    if (this.isSelecting) {
      this.setState({ selectedIndex: newIndex })
    }
  }

  // 40 is down, 38 is up
  handleKeyDown = e => {
    if (e.keyCode === 40) {
      this.goToNext()
      this.isSelecting = true
    }
  }

  render() {
    const { options, selectedIndex } = this.state

    return (
      <div className="LocationSuggest">
        <TextField
          fullWidth
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          className={this.props.classes.margin}
          label="Location"
          onFocus={this.handleFocus}
          InputProps={{
            placeholder: 'Type to search',
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          defaultValue=""
        />
        <Options
          options={options}
          onChange={this.props.onChange}
          isSelecting={this.isSelecting}
          selectedIndex={options[selectedIndex] && options[selectedIndex].id}
        />
      </div>
    )
  }
}

LocationSuggest.propTypes = {
  bindShortcut: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(mouseTrap(LocationSuggest))
