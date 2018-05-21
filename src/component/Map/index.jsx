import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'
import React from 'react'
import PropTypes from 'prop-types'
import PositionMarker from '../PositionMarker'

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
    const { defaultPosition, markerPosition, onDragEnd, mapStyle, maxZoom, minZoom, defaultZoom } = this.props

    return (
      <GoogleMap
        ref={r => {
          this.gmap = r
        }}
        defaultZoom={defaultZoom}
        defaultCenter={defaultPosition}
        onTilesLoaded={handleLoaded}
        onDragEnd={onDragEnd}
        options={{
          maxZoom,
          minZoom,
          styles: mapStyle,
          disableDefaultUI: true,
        }}
      >
        {markerPosition && <PositionMarker position={markerPosition} />}
      </GoogleMap>
    )
  }
}

Map.propTypes = {
  defaultPosition: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  markerPosition: PropTypes.oneOfType([
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
    PropTypes.bool,
  ]).isRequired,
  onDragEnd: PropTypes.func.isRequired,
  mapStyle: PropTypes.array.isRequired,
  minZoom: PropTypes.number.isRequired,
  maxZoom: PropTypes.number.isRequired,
  defaultZoom: PropTypes.number.isRequired,
}

export default withScriptjs(withGoogleMap(Map))
