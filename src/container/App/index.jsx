import { Button, Card, CardActions, CardContent, CardMedia, TextField } from '@material-ui/core'
import 'babel-polyfill'
import { Form, Formik, Field } from 'formik'
import React from 'react'
import Map from 'component/Map'
import Report from 'component/Report'
import CountrySuggest from 'component/CountrySuggest'
import { fetchGeoLocation, fetchWeatherByCity, fetchWeatherByLocation } from 'tools/weather'
import * as mapStyles from 'tools/mapStyles'
import './index.scss'

const smoothZoomIn = (map, max, cnt) => {
  if (cnt >= max + 1) {
    return false
  }

  const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
    window.google.maps.event.removeListener(z)
    smoothZoomIn(map, max, cnt + 1)
  })
  setTimeout(() => {
    map.setZoom(cnt)
  }, 80)

  return true
}

const smoothZoomOut = (map, min, cnt) => {
  if (cnt < min) {
    return false
  }

  const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
    window.google.maps.event.removeListener(z)
    smoothZoomOut(map, min, cnt - 1)
  })
  setTimeout(() => {
    map.setZoom(cnt)
  }, 80)

  return true
}

const initialState = {
  notFound: false,
  loading: false,
  data: false,
  mapStyleKey: 'apple',
  coords: {
    lat: 51,
    lng: 0,
  },
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.dragged = false
    this.form = null
    this.state = { ...initialState }

    this.updateWeather = this.updateWeather.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.initLocation = this.initLocation.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentWillMount() {
    if (window.navigator && window.navigator.geolocation) {
      this.initLocation()
    } else {
      this.initLocation(true)
    }
  }

  async handleDrag() {
    this.dragged = true

    const center = window.gmap.getCenter()

    const coords = {
      lat: center.lat(),
      lon: center.lng(),
    }

    const resp = await fetchWeatherByLocation(coords)

    this.updateWeather(resp, {
      lat: center.lat(),
      lng: center.lng(),
    })
  }

  async handleFormChange(values) {
    const resp = await fetchWeatherByCity(values)

    this.updateWeather(resp)
  }

  async initLocation(useDefaults) {
    const { state } = this

    if (!useDefaults) {
      fetchGeoLocation(async position => {
        const coords = position
          ? { lat: position.coords.latitude, lon: position.coords.longitude }
          : { lat: state.coords.lat, lon: state.coords.lng }

        const resp = await fetchWeatherByLocation(coords)

        if (!this.dragged) {
          this.updateWeather(resp, false, true)
        }
      })
    } else {
      const resp = await fetchWeatherByLocation({
        lat: state.coords.lat,
        lon: state.coords.lng,
      })

      if (!this.dragged) {
        this.updateWeather(resp, false, true)
      }
    }
  }

  updateWeather(resp, coords = false, initial = false) {
    if (!resp) {
      this.setState({ ...initialState, notFound: true })
    } else if (resp === 404) {
      this.setState({ ...initialState, notFound: true })
    } else if (!coords) {
      this.dragged = true

      this.setState({
        ...initialState,
        data: resp.data,
        notFound: false,
      })

      const map = window.gmap

      if (map) {
        map.panTo({
          lat: resp.data.coord.lat,
          lng: resp.data.coord.lon,
        })

        if (!initial) {
          setTimeout(() => {
            smoothZoomIn(window.gmap, 10, window.gmap.getZoom())
          }, 250)
        }
      }
    } else {
      this.dragged = true

      this.setState({
        ...initialState,
        data: resp.data,
        notFound: false,
        coords,
      })

      this.form.setFieldValue('city', resp.data.name)
      this.form.setFieldValue('country', resp.data.sys.country.toLowerCase())
    }
  }

  render() {
    const { handleFormChange, handleDrag, form } = this
    const { loading, data, coords, notFound, mapStyleKey } = this.state
    const weather = data && data.weather && data.weather[0]
    const mapStyle = mapStyles[mapStyleKey]

    return (
      <Card className="App">
        <CardMedia
          className="App__media"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          title="Weather App"
        >
          <div className="App__media-inner">
            <Map
              mapStyle={mapStyle}
              containerElement={<div style={{ height: '100%', opacity: 1 }} />}
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDkrrRqeUXM8C--BEfoXeLoEYBwV3YOjYQ&libraries=visualization"
              loadingElement={<div style={{ height: '100%' }} />}
              mapElement={<div style={{ height: '100%' }} />}
              position={{ lat: coords.lat, lng: coords.lng }}
              onDragEnd={handleDrag}
            />
            {notFound && <div className="App__notfound">Could not find city</div>}
            {weather && (
              <div className="App__media-overlay">
                <Report
                  id={weather.id}
                  location={data.name}
                  icon={weather.icon}
                  timestamp={data.dt}
                  temp={data.main.temp}
                  country={data.sys.country}
                />
              </div>
            )}
          </div>
        </CardMedia>
        <Formik
          onSubmit={values => handleFormChange(values)}
          ref={r => {
            this.form = r
          }}
          initialValues={{
            city: '',
            country: '',
          }}
          render={({ values, dirty, handleChange, handleBlur, handleSubmit }) => (
            <Form className="App__form" onSubmit={handleSubmit}>
              <CardContent className="App_content">
                <Field
                  name="city"
                  value={values.city}
                  render={({ field }) => (
                    <TextField
                      className="App__field App__field-city"
                      label="City"
                      value={field.value}
                      name={field.name}
                      id={field.name}
                      disabled={loading}
                      fullWidth
                      onChange={e => {
                        const { value } = e.target
                        const map = window.gmap

                        if (!value && map) {
                          smoothZoomOut(map, 6, map.getZoom())
                        }

                        handleChange(e)
                      }}
                      onBlur={handleBlur}
                      onFocus={self => {
                        const { value } = self.target
                        const map = window.gmap

                        if (map && value) {
                          smoothZoomOut(map, 6, map.getZoom())
                        }

                        if (form) {
                          form.setFieldValue('city', '')
                          form.setFieldValue('country', '')
                        }
                      }}
                    />
                  )}
                />
                <Field
                  className="yo"
                  name="country"
                  value={values.country}
                  render={({ field }) => (
                    <CountrySuggest name={field.name} value={field.value} onBlur={handleBlur} onChange={handleChange} />
                  )}
                />
              </CardContent>
              <CardActions className="App__actions">
                <Button
                  className="App__button App__button-submit"
                  color="primary"
                  type="submit"
                  disabled={loading || !dirty || values.city === ''}
                  size="small"
                >
                  Get Weather
                </Button>
              </CardActions>
            </Form>
          )}
        />
      </Card>
    )
  }
}

export default App
