import { handleError } from 'utils/actions';

export const initialize = () => handleError(async(dispatch, getState, { api }) => {
  await api.initialize(dispatch);
}, 'An error ocurred initializing the system');

export const saveSettings = (settings) => handleError((dispatch) => {
  return true;
}, 'An error ocurred saving the settings');