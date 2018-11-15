import { combineReducers } from 'redux';
import { modals } from 'controls/modals/reducer';


const capturing = (state = false, action) => action.type === 'SET_CAPTURING' ? (action.capturing || false) : state;
const settings = (state = {}, action) => action.type === 'SET_SETTINGS' ? (action.settings || {}) : state;
const text = (state = '', action) => {
  switch (action.type) {
    case 'SET_CAPTURING': return '';
    case 'SET_TEXT': return action.text;
    default: return state;
  }
};

export const rootReducer = combineReducers({
  modals,
  capturing,
  settings,
  text,
});