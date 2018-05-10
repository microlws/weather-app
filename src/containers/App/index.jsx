import React from 'react';
import Titles from 'components/Titles';
import Form from 'components/Form';
import Weather from 'components/Weather';
import './index.scss';

const API_KEY = 'e79aecff0a08da73f6f6de08be893f7d';

class App extends React.Component {
  getWeather = async () => {
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Aarhus&APPID=${API_KEY}&units=metric`);
    const data = await api_call.json();
    console.log(data);
  };
  render() {
    return (
      <div className='App'>
        <Titles />
        <Form getWeather={this.getWeather}/>
        <Weather />
      </div>
    );
  }
};
export default App;
