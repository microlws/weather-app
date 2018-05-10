import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import domready from 'domready';
import App from 'containers/App';
import configureStore from './store/configureStore';

const store = configureStore();

const renderApp = (Component) => {
  domready(() => {
    ReactDOM.render(
      <Provider store={ store }>
        <AppContainer>
          <Component store={ store } />
        </AppContainer>
      </Provider>,
      document.getElementById('root'),
    );
  });
};

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('containers/App', () => renderApp(App));
}
