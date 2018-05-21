import { Card, CardContent, CardMedia, TextField } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import Map from 'component/Map'
import Report from 'component/Report'
import CountrySuggest from 'component/CountrySuggest'
import MapStylePicker from 'component/MapStylePicker'
import LocationSuggest from 'component/LocationSuggest'
import { fetchGeoLocation, fetchWeatherByLocation } from 'tools/weather'
import { getCountryNameFromCode } from 'tools/countries'
import { smoothZoomIn, smoothZoomOut } from 'tools/googleZoom'
import * as mapStyles from 'tools/mapStyles'
import CssBaseline from '@material-ui/core/CssBaseline'
import './index.scss'

const SETTINGS = {
  MAX_ZOOM: 15,
  MIN_ZOOM: 3,
  CLOSEUP_ZOOM: 10,
  DEFAULT_ZOOM: 6,
  GOOGLE_KEY: 'AIzaSyAP70dQfEIvqOSQ7O8tXMEuErqQsa7V0wE',
  GOOGLE_URL_GEOCODE: 'https://maps.googleapis.com/maps/api/geocode/json',
  GOOGLE_URL_MAPS: 'https://maps.googleapis.com/maps/api/js',
  DEFAULT_POSITION: {
    lat: 51,
    lng: 0,
  },
}

const initialState = {
  notFound: false,
  loading: false,
  data: false,
  position: false,
}

class App extends React.Component {
  dragged = false

  pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  state = { ...initialState, mapStyleKey: 'flat' }

  componentWillMount() {
    this.initLocation(window.navigator && window.navigator.geolocation)
  }

  handleDrag = async () => {
    this.dragged = true

    const { mapToWeatherPos, updateWeather, mapPan } = this
    const map = window.gmap

    const z = google.maps.event.addListener(map, 'idle', async () => {
      const center = window.gmap.getCenter()

      let position = {
        lat: center.lat(),
        lng: center.lng(),
      }

      const weather = await fetchWeatherByLocation(mapToWeatherPos(position))

      if (weather && weather.data && weather.data.name) {
        const geolocation = await axios.get(
          `${SETTINGS.GOOGLE_URL_GEOCODE}?key=${SETTINGS.GOOGLE_KEY}&address=${
            weather.data.name
          }+${getCountryNameFromCode(weather.data.sys.country)}`,
        )
        const geoData = geolocation.data

        if (geoData && geoData.results && geoData.results.length) {
          const result = geoData.results[0]
          position = result.geometry.location
        }
      }

      updateWeather(weather)
      // mapPan(position)

      google.maps.event.removeListener(z)
    })
  }

  handleFormChange = async ({ position }) => {
    const { weatherToMapPos, mapToWeatherPos, updateWeather, mapPan, mapZoom } = this

    const response = await fetchWeatherByLocation(mapToWeatherPos(position))

    updateWeather(response)
    mapPan(weatherToMapPos(response.data))
    mapZoom(250)
  }

  initLocation = async useDefaultLocation => {
    const { dragged, mapToWeatherPos, locationToWeatherPos, weatherToMapPos, updateWeather, mapPan } = this

    if (!useDefaultLocation) {
      fetchGeoLocation(async geoLocation => {
        const position = geoLocation ? locationToWeatherPos(geoLocation) : mapToWeatherPos(SETTINGS.DEFAULT_POSITION)
        const response = await fetchWeatherByLocation(position)

        updateWeather(response)

        if (!dragged) {
          mapPan(weatherToMapPos(position))
        }
      })
    } else {
      const weatherPos = mapToWeatherPos(SETTINGS.DEFAULT_POSITION)
      const response = await fetchWeatherByLocation(weatherPos)

      updateWeather(response)

      if (!dragged) {
        mapPan(weatherToMapPos(response.data))
      }
    }
  }

  updateWeather = response => {
    if (response && response !== 404) {
      this.setState({
        ...initialState,
        data: response.data,
      })
    } else {
      this.setState({
        ...initialState,
        notFound: true,
      })
    }
  }

  handleMapStyleChange = mapStyleKey => {
    this.setState({ mapStyleKey })
  }

  mapZoom = delay => {
    const map = window.gmap

    if (map) {
      setTimeout(() => {
        smoothZoomIn(map, SETTINGS.CLOSEUP_ZOOM, map.getZoom())
      }, delay)
    }
  }

  mapPan = position => {
    const map = window.gmap

    if (map) {
      map.panTo(position)
    }
  }

  weatherToMapPos = ({ coord }) => {
    return {
      lat: coord.lat,
      lng: coord.lon,
    }
  }

  mapToWeatherPos = ({ lat, lng }) => {
    return {
      lat,
      lon: lng,
    }
  }

  locationToWeatherPos = ({ coords }) => {
    return {
      lat: coords.latitude,
      lon: coords.longitude,
    }
  }

  render() {
    const { handleFormChange, handleDrag, handleMapStyleChange, pixel } = this
    const { loading, data, notFound, mapStyleKey, position } = this.state
    const weather = data && data.weather && data.weather[0]
    const mapStyle = mapStyles[mapStyleKey]

    return (
      <CssBaseline>
        <Card className="App">
          <CardMedia className="App__media" src={pixel} title="Weather App">
            <div className="App__media-inner">
              <Map
                containerElement={<div style={{ height: '100%', opacity: 1 }} />}
                defaultPosition={SETTINGS.DEFAULT_POSITION}
                defaultZoom={SETTINGS.DEFAULT_ZOOM}
                googleMapURL={`${SETTINGS.GOOGLE_URL_MAPS}?key=${SETTINGS.GOOGLE_KEY}`}
                loadingElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                mapStyle={mapStyle}
                maxZoom={SETTINGS.MAX_ZOOM}
                minZoom={SETTINGS.MIN_ZOOM}
                onDragEnd={handleDrag}
                position={position}
              />
              <div className="App__mapstylepicker">
                <MapStylePicker value={this.state.mapStyleKey} onChange={handleMapStyleChange} />
              </div>
              {notFound && <div className="App__notfound">Could not find city</div>}
              {weather && (
                <div className="App__media-overlay">
                  <div className="App__media-report">
                    <Report
                      id={weather.id}
                      location={data.name}
                      icon={weather.icon}
                      timestamp={data.dt}
                      temp={data.main.temp}
                      country={(data.sys && data.sys.country) || ''}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardMedia>
          <CardContent className="App_content">
            <div className="App__locations">
              <LocationSuggest onChange={handleFormChange} />
            </div>
          </CardContent>
        </Card>
      </CssBaseline>
    )
  }
}

export default App
