import './app.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet/es/Helmet';
import { Route, Switch } from 'react-router-dom';

import { displayRandomMessage } from 'actions';
import favicon from 'img/favicon.png';

const mapStateToProps = (state) => ({ message: state.message });
const mapDispatchToProps = (dispatch) => bindActionCreators({ displayRandomMessage }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.PureComponent {

  static propTypes = {
    message: PropTypes.string.isRequired,
    displayRandomMessage: PropTypes.func.isRequired
  }

  render() {
    const { displayRandomMessage, message } = this.props;
    return (
      <div className='main-app'>
        <Helmet >
          <title>React Starter!</title>
          <html lang='en' />
          <meta charset='utf-8' />
          <meta name='description' content='Awesome react starter' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <link rel='icon' href={favicon} type='image/png' sizes='32x32' />
        </Helmet>
        <Switch>
          <Route exact path='/' render={() => (
            <div className='container'>
              <h1 onClick={displayRandomMessage}>Hello</h1>
              <p className='world'>{message}</p>
            </div>)}
          />
          <Route render={() => <h1>404</h1>} />
        </Switch>
      </div>
    );
  }
}