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

export const toggleCapture = () => handleError(async (dispatch, getState, { api }) => {
  const { settings, capturing } = getState();
  const { key, language, region } = settings;
  const newCapturing = !capturing;

  dispatch({ type: 'SET_CAPTURING', capturing: newCapturing });

  try {

    if (newCapturing)
      await api.startContinuousRecognition({ key, region, language });
    else
      await api.stopContinuousRecognition();

  } catch (error) {
    dispatch({ type: 'SET_CAPTURING', capturing: !newCapturing });
    throw error;
  }

  return true;
}, 'An error ocurred while toggling the capture');