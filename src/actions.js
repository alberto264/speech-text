import { handleError } from 'utils/actions';

export const initialize = () => handleError(async(dispatch, getState, { api }) => {

  const settings = await localStorage.getItem('settings');
  if (settings)
    dispatch({ type: 'SET_SETTINGS', settings: JSON.parse(settings) });

  await api.initialize(dispatch);
}, 'An error ocurred initializing the system');
export const changeFontSize = (fontSize) => saveSettings({ fontSize });
export const saveSettings = (newSettings) => handleError(async (dispatch, getState) => {
  const { settings } = getState();

  newSettings = { ...settings, ...newSettings };

  dispatch({ type: 'SET_SETTINGS', settings: newSettings });
  await localStorage.setItem('settings', JSON.stringify(newSettings));

  return true;
}, 'An error ocurred saving the settings');

export const toggleCapture = () => handleError((dispatch, getState) => {
  dispatch({ type: 'SET_CAPTURING', capturing: !getState().capturing });
  return true;
}, 'An error ocurred while toggling the capture');