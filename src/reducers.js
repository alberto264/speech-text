import { combineReducers } from 'redux';
import { modals } from 'controls/modals/reducer';


const capturing = (state = false, action) => action.type === 'SET_CAPTURING' ? (action.capturing || false) : state;
const settings = (state = {}, action) => action.type === 'SET_SETTINGS' ? (action.settings || {}) : state;

export const rootReducer = combineReducers({
  modals,
  capturing,
  settings,
});