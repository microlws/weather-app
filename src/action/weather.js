import * as types from '../constant/actionTypes';

export function weatherReset() {
  return function weatherResetDispatch(dispatch) {
    return dispatch({
      type: types.WEATER_RESET,
    });
  };
}

export function weatherData(settings) {
  return function weatherDataDispatch(dispatch) {
    return dispatch({
      type: types.WEATER_DATA,
      settings,
    });
  };
}

export function weatherUpdate(settings) {
  return function weatherUpdateDispatch(dispatch) {
    return dispatch({
      type: types.WEATER_UPDATE,
      settings,
    });
  };
}
