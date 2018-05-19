import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'
import React from 'react'
import PropTypes from 'prop-types'
import { flat } from '../../tools/mapStyles'

const Map = ({ position }) => (
  <GoogleMap
    defaultZoom={6}
    defaultCenter={position}
    center={position}
    options={{
      mapTypeControl: false,
      maxZoom: 6,
      minZoom: 6,
      panControl: false,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      styles: flat,
    }}
  />
)

Map.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
}

export default withScriptjs(withGoogleMap(Map))
