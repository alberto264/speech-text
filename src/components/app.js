import './app.less';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet/es/Helmet';
import { hot } from 'react-hot-loader';

import { NotFound, ErrorBoundary } from './common';
import { Home } from './home';
import { ModalController } from 'controls/modals';

const mapStateToProps = (state) => ({ modals: state.modals });

@hot(module)
@connect(mapStateToProps)
export class App extends PureComponent {

  static propTypes = {
    modals: PropTypes.any.isRequired,
  }


  render() {
    const { modals } = this.props;

    return (
      <div className='bg-near-white flex w-100' >
        <Helmet titleTemplate={'%s | S2T'} defaultTitle='S2T' >
          <html lang='es' />
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <link rel='icon' href={require('img/favicon.png')} type='image/png' sizes='32x32' />
        </Helmet>
        <ErrorBoundary>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route component={NotFound} />
          </Switch>
          <ModalController modals={modals} />
        </ErrorBoundary>
      </div>
    );
  }
}