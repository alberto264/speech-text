//import {combineReducers} from 'redux';

export const rootReducer = (state = { message: ''}, action) => {

  switch(action.type) {
    case 'SEND_MESSAGE': return { message: action.message };
    default: return state;
  }

};