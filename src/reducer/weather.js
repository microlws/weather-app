import * as type from '../constant/actionTypes';

export const weatherInitialState = {
  loading: false,
  loaded: false,
  notFound: false,
  data: {
    coord: {
      lon: 0,
      lat: 0
    },
    weather: [{
      id: 0,
      main: '',
      description: '',
      icon: ''
    }],
    base: '',
    main: {
      temp: 0,
      pressure: 0,
      humidity: 0,
      temp_min: 0,
      temp_max: 0
    },
    wind: {
      speed: 0,
      deg: 0
    },
    clouds: {
      all: 0
    },
    dt: 0,
    sys: {
      type: 0,
      id: 0,
      message: 0,
      country: '',
      sunrise: 0,
      sunset: 0
    },
    id: 0,
    name: '',
    cod: 0
  }
}

export function weatherReducer(state = weatherInitialState, action) {
  switch (action.type) {
    case type.WEATER_RESET:
      return {
        ...state,
      };

    case type.WEATER_DATA:
      return {
        ...state,
        data: action.settings,
        loaded: true,
        loading: false,
        notFound: false,
      };

    case type.WEATER_UPDATE:
      return {
        ...state,
        ...action.settings
      };

    default:
      return state;
  }
}
