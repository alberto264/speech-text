import './app.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet/es/Helmet';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';


import { displayRandomMessage } from 'actions';

const mapStateToProps = (state) => ({ message: state.message });
const mapDispatchToProps = (dispatch) => bindActionCreators({ displayRandomMessage }, dispatch);

@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.PureComponent {

  static propTypes = {
    message: PropTypes.string.isRequired,
    displayRandomMessage: PropTypes.func.isRequired
  }

  render() {
    const { displayRandomMessage, message } = this.props;
    return (
      <div id='main-app' className='bg-moon-gray flex items-center flex-column vh-100' >
        <Helmet >
          <title>React Starter!</title>
          <html lang='en' />
          <meta charset='utf-8' />
          <meta name='description' content='Awesome react starter' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <link rel='icon' href={require('img/favicon.png')} type='image/png' sizes='32x32' />
        </Helmet>
        <Switch>
          <Route exact path='/' render={() => (
            <div className='tc'>
              <h1 className='f-humungus mv0 mid-gray pointer' onClick={displayRandomMessage}>Hello</h1>
              <p className='f-massive mv0 mid-gray'>{message}</p>
            </div>)}
          />
          <Route render={() => <h1 className='f-humungus mv0 mid-gray' >404</h1>} />
        </Switch>
      </div>
    );
  }
}