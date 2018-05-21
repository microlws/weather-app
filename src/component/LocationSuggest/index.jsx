import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Options from './Options'
import axios from 'axios'
import './index.scss'

class LocationSuggest extends React.Component {
  timeout = null

  state = {
    options: [],
  }

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
    const { fetchOptions, timeout, updateOptions } = this
    const { value } = e.target

    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      updateOptions(value)
    }, 300)
  }

  render() {
    return (
      <div className="LocationSuggest">
        <TextField
          fullWidth
          onChange={this.handleInputChange}
          className="LocationSuggest__input"
          label="Location"
          inputProps={{ name, id: name, placeholder: 'Enter minimum 2 characters to search' }}
          defaultValue=""
        />
        <Options options={this.state.options} onChange={this.props.onChange} />
      </div>
    )
  }
}

LocationSuggest.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default LocationSuggest
