import 'theme/theme.less';
import 'lib/microsoft.cognitiveservices.speech.sdk.bundle';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';

import { Api } from './api';
import { App } from './components/app';
import { rootReducer } from './reducers';
import { initialize } from './actions';


const api = new Api();
const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk.withExtraArgument({ api }))));

store.dispatch(initialize());

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Route component={Component} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
}