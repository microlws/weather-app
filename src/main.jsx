import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import domready from 'domready'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './container/App'
import './scss/main.scss'

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: '#fffe6c',
      main: '#f2cb38',
      dark: '#bb9b00',
      contrastText: '#000000',
    },
    primary: {
      light: '#648bd0',
      main: '#2f5e9f',
      dark: '#003570',
      contrastText: '#ffffff',
    },
  },
})

const renderApp = Component => {
  domready(() => {
    ReactDOM.render(
      <MuiThemeProvider theme={theme}>
        <Component />
      </MuiThemeProvider>,
      document.getElementById('root'),
    )
  })
}

renderApp(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./container/App', () => renderApp(App))
}
