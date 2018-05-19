import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'
import React from 'react'
import PropTypes from 'prop-types'

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.handleLoaded = this.handleLoaded.bind(this)

    this.gmap = null
  }

  handleLoaded() {
    // eslint-disable-next-line no-underscore-dangle
    window.gmap = this.gmap.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  }

  render() {
    const { handleLoaded } = this
    const { position, onDragEnd, mapStyle } = this.props

    return (
      <GoogleMap
        ref={r => {
          this.gmap = r
        }}
        defaultZoom={6}
        defaultCenter={position}
        center={position}
        onTilesLoaded={handleLoaded}
        onDragEnd={onDragEnd}
        options={{
          disablePanMomentum: true,
          mapTypeControl: false,
          maxZoom: 15,
          minZoom: 3,
          panControl: false,
          scaleControl: false,
          streetViewControl: false,
          zoomControl: false,
          styles: mapStyle,
          disableDefaultUI: true,
        }}
      />
    )
  }
}

Map.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  onDragEnd: PropTypes.func.isRequired,
  mapStyle: PropTypes.array.isRequired,
}

export default withScriptjs(withGoogleMap(Map))
