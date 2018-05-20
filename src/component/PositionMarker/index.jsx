import React from 'react'
import PropTypes from 'prop-types'
import { OverlayView } from 'react-google-maps'
import getPixelPositionOffset from 'tools/getPixelPositionOffset'
import './index.scss'

const PositionMarker = props => {
  return (
    <OverlayView
      getPixelPositionOffset={getPixelPositionOffset}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      position={props.position}
    >
      <div className="PositionMarker" />
    </OverlayView>
  )
}

PositionMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
}

export default PositionMarker
