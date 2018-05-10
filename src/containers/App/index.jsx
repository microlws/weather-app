import React from 'react'
import fetch from 'fetch'
import Titles from 'components/Titles'
import Form from 'components/Form'
import Weather from 'components/Weather'
import './index.scss'

const API_KEY = 'e79aecff0a08da73f6f6de08be893f7d'

const openWeatherMap = async () => {
  const apiCall = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Aarhus&APPID=${API_KEY}&units=metric`)
  const data = apiCall.json()
  return data
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Titles />
        <Form getWeather={openWeatherMap} />
        <Weather />
      </div>
    )
  }
}
export default App
