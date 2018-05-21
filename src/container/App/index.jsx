import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CssBaseline from '@material-ui/core/CssBaseline'
import axios from 'axios'
import LocationSuggest from 'component/LocationSuggest'
import Map from 'component/Map'
import Report from 'component/Report'
import React from 'react'
import * as mapStyles from 'tools/mapStyles'
import { fetchGeoLocation, fetchWeatherByLocation } from 'tools/weather'
import './index.scss'

const SETTINGS = {
  MAX_ZOOM: 15,
  MIN_ZOOM: 3,
  DEFAULT_ZOOM: 6,
  GOOGLE_KEY: 'AIzaSyAP70dQfEIvqOSQ7O8tXMEuErqQsa7V0wE',
  GOOGLE_URL_GEOCODE: 'https://maps.googleapis.com/maps/api/geocode/json',
  GOOGLE_URL_MAPS: 'https://maps.googleapis.com/maps/api/js',
  DEFAULT_POSITION: {
    lat: 51,
    lng: 0,
  },
}

const getAddressInfo = (k, o) => {
  let f = ''

  o.some(i => {
    if (i.types.includes(k)) {
      f = i.long_name
    }
    return i.types.includes(k)
  })

  return f
}

class App extends React.Component {
  state = {
    mapStyleKey: 'flat', // or neutralBlue for night
    data: false,
    markerPosition: false,
    location: '',
  }

  componentWillMount() {
    this.initLocation(window.navigator && window.navigator.geolocation)
  }

  dragged = false

  pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  handleDrag = async () => {
    this.dragged = true

    const { mapToWeatherPos, updateWeather, updateLocationByPosition } = this
    const map = window.gmap

    const z = window.google.maps.event.addListener(map, 'idle', async () => {
      const center = window.gmap.getCenter()

      const position = {
        lat: center.lat(),
        lng: center.lng(),
      }

      const weather = await fetchWeatherByLocation(mapToWeatherPos(position))

      updateWeather(weather, position)
      updateLocationByPosition(position)

      // Is it night or day..
      const weatherData = weather.data.weather[0]

      if (weatherData) {
        const nightOrDay = weatherData.icon.slice(-1)

        if (nightOrDay === 'n') {
          this.setState({ mapStyleKey: 'neutralBlue' })
        } else {
          this.setState({ mapStyleKey: 'flat' })
        }
      }

      window.google.maps.event.removeListener(z)
    })
  }

  updateLocation = (location = '') => {
    this.setState({ location })
  }

  handleFormChange = async ({ position, location }) => {
    const { mapToWeatherPos, updateWeather, mapPan, updateLocation } = this

    const response = await fetchWeatherByLocation(mapToWeatherPos(position))

    updateLocation(location)
    updateWeather(response, position)
    mapPan(position)
  }

  initLocation = async useDefaultLocation => {
    const {
      dragged,
      locationToWeatherPos,
      mapPan,
      mapToWeatherPos,
      updateLocationByPosition,
      updateWeather,
      weatherToMapPos,
    } = this

    if (!useDefaultLocation) {
      fetchGeoLocation(async geoLocation => {
        const position = geoLocation ? locationToWeatherPos(geoLocation) : mapToWeatherPos(SETTINGS.DEFAULT_POSITION)
        const response = await fetchWeatherByLocation(position)

        updateWeather(response, weatherToMapPos(position))
        updateLocationByPosition(weatherToMapPos(position))

        if (!dragged) {
          mapPan(weatherToMapPos(position))
        }
      })
    } else {
      const weatherPos = mapToWeatherPos(SETTINGS.DEFAULT_POSITION)
      const response = await fetchWeatherByLocation(weatherPos)

      updateWeather(response, SETTINGS.DEFAULT_POSITION)
      updateLocationByPosition(SETTINGS.DEFAULT_POSITION)

      if (!dragged) {
        mapPan(weatherToMapPos(response.data.coord))
      }
    }
  }

  updateWeather = (response, position) => {
    if (response && response !== 404) {
      this.setState({ data: response.data, markerPosition: position })
    } else {
      this.setState({ data: false })
    }
  }

  updateLocationByPosition = async ({ lat, lng }) => {
    let location = ''

    const geolocation = await axios.get(
      `${SETTINGS.GOOGLE_URL_GEOCODE}?key=${SETTINGS.GOOGLE_KEY}&latlng=${lat},${lng}`,
    )
    const geoData = geolocation.data

    if (geoData && geoData.results && geoData.results.length) {
      const result = geoData.results[0]

      // Now build our own location string
      const country = getAddressInfo('country', result.address_components)
      const locality = getAddressInfo('locality', result.address_components)
      const postalTown = getAddressInfo('postal_town', result.address_components)
      const level2 = getAddressInfo('administrative_area_level_2', result.address_components)
      const level3 = getAddressInfo('administrative_area_level_3', result.address_components)
      const local = locality || postalTown || level2 || level3

      location = `${local && country ? `${local}, ` : ''}${country}`
    }

    this.updateLocation(location)
  }

  mapPan = position => {
    const map = window.gmap

    if (map) {
      map.panTo(position)
    }
  }

  weatherToMapPos = ({ lat, lon }) => ({
    lat,
    lng: lon,
  })

  mapToWeatherPos = ({ lat, lng }) => ({
    lat,
    lon: lng,
  })

  locationToWeatherPos = ({ coords }) => ({
    lat: coords.latitude,
    lon: coords.longitude,
  })

  render() {
    const { handleFormChange, handleDrag, pixel } = this
    const { data, mapStyleKey, markerPosition, location } = this.state
    const weather = data && data.weather && data.weather[0]
    const mapStyle = mapStyles[mapStyleKey]

    return (
      <CssBaseline>
        <Card className="App">
          <CardMedia className="App__media" src={pixel} title="Weather App">
            <div className="App__map">
              <Map
                containerElement={<div style={{ height: '100%' }} />}
                defaultPosition={SETTINGS.DEFAULT_POSITION}
                defaultZoom={SETTINGS.DEFAULT_ZOOM}
                googleMapURL={`${SETTINGS.GOOGLE_URL_MAPS}?key=${SETTINGS.GOOGLE_KEY}&libraries=places`}
                loadingElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                mapStyle={mapStyle}
                maxZoom={SETTINGS.MAX_ZOOM}
                minZoom={SETTINGS.MIN_ZOOM}
                onDragEnd={handleDrag}
                markerPosition={markerPosition}
              />
              {!data && <div className="App__notfound">No Weather Data Available</div>}
              {weather && (
                <div className="App__media-overlay">
                  <div className="App__media-report">
                    <Report
                      id={weather.id}
                      location={location}
                      icon={weather.icon}
                      timestamp={data.dt}
                      temp={data.main.temp}
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
