import { handleError } from 'utils/actions';

export const initialize = () => handleError(async(dispatch, getState, { api }) => {
  await api.initialize(dispatch);
}, 'An error ocurred initializing the system');