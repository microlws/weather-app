import axios from 'axios'

const API_KEY = 'e79aecff0a08da73f6f6de08be893f7d'

export const fetchGeoLocation = fn => {
  window.navigator.geolocation.getCurrentPosition(pos => fn(pos), () => fn(false), {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0,
  })
}

export const fetchWeather = async url => {
  let resp = false

  try {
    resp = await axios.post(url)
  } catch (e) {
    if (e.message === 'Request failed with status code 404') {
      resp = 404
    }
  }

  return resp
}

export const fetchWeatherByLocation = async ({
  lat,
  lon
}) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`


  return fetchWeather(url)
}

export const fetchWeatherByCity = async ({
  city,
  country
}) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}${
    country ? `,${country}` : ''
  }&APPID=${API_KEY}&units=metric`

  return fetchWeather(url)
}
