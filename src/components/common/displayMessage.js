import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet/es/Helmet';
import React, { PureComponent } from 'react';
import { Header, Image, Segment } from 'semantic-ui-react';
import cx from 'classnames';

export class DisplayMessage extends PureComponent {

  static propTypes = {
    redirect: PropTypes.bool,
    header: PropTypes.node.isRequired,
    content: PropTypes.node,
    helmet: PropTypes.string,
    history: PropTypes.object,
  }

  componentDidMount() {
    if (this.props.redirect && this.props.history)
      setTimeout(() => { this.props.history.replace('/'); }, 3000);
  }

  render() {
    let { header, content, redirect, helmet } = this.props;

    if (!content && redirect)
      content = 'Wait 3 seconds to be redirected...';

    return (
      <div className='display-message flex items-center flex-column min-vh-100 w-100 pa3' >
        <Helmet title={helmet || header} />
        <div className='flex-auto flex justify-center flex-column' >
          <Image src={require('img/logo.png')} alt='logo' size='medium' className='mh-auto mb3' />
          <Segment raised color='black' textAlign='center' padded >
            <Header size='large' >
              <Header.Content className={cx('normal', { mb2: !!content })} >
                {header}
              </Header.Content>
              <Header.Subheader>
                {content}
              </Header.Subheader>
            </Header>
          </Segment>
        </div>
        <span className='self-end pt3 mt-auto' >Developed by <a className='contrast dim' href='https://github.com/elios264' target='_blank'>elios264</a></span>
      </div>
    );
  }
}
