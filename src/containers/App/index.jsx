import React from 'react';
import Titles from 'components/Titles';
import Form from 'components/Form';
import Weather from 'components/Weather';
import './index.scss';

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <Titles />
        <Form />
        <Weather />
      </div>
    );
  }
};
export default App;
