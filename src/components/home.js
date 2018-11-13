import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Transition } from 'semantic-ui-react';

import { SettingsModal } from './settingsModal';
import { toggleCapture, changeFontSize } from 'actions';
import { Range } from 'controls';


const mapDispatchToProps = (dispatch) => bindActionCreators({ toggleCapture, changeFontSize }, dispatch);
const mapStateToProps = (state) => ({
  capturing: state.capturing,
  fontSize: state.settings.fontSize || 1
});


@connect(mapStateToProps, mapDispatchToProps)
export class Home extends PureComponent {

  static propTypes = {
    fontSize: PropTypes.number.isRequired,
    capturing: PropTypes.bool.isRequired,
    toggleCapture: PropTypes.func.isRequired,
    changeFontSize: PropTypes.func.isRequired,
  }

  state = { settingsVisible: false, iconsVisible: false }

  showSettings = () => this.setState({ settingsVisible: true });
  hideSettings = () => this.setState({ settingsVisible: false });

  showIconsForAMoment = _.throttle(() => {
    const { iconsVisible, settingsVisible } = this.state;

    if (settingsVisible)
      return;

    if (this.timeoutId)
      clearTimeout(this.timeoutId);

    if (!iconsVisible)
      this.setState({ iconsVisible: true });


    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.setState({ iconsVisible: false });
    }, 2000);

  }, 200, { leading: true });

  render() {
    const { capturing, toggleCapture, fontSize, changeFontSize } = this.props;
    const { settingsVisible, iconsVisible } = this.state;

    return (
      <div className='w-100 flex justify-center items-center' onMouseMove={this.showIconsForAMoment} >
        <Transition duration={600} animation='fly right' visible={iconsVisible}>
          <div className='absolute top-1 left-1' >
            <Icon color='grey' link name={capturing ? 'pause' : 'play'} size='large' onClick={toggleCapture} />
            <Icon color='grey' disabled={capturing} link={!capturing} name='cog' size='large' onClick={capturing ? _.noop : this.showSettings} />
            <Range value={fontSize} onChange={changeFontSize} orientation='vertical' min={1} max={100} tooltip={false} />
          </div>
        </Transition>
        { settingsVisible && <SettingsModal onCancel={this.hideSettings} /> }

        <h1 className='tc black' style={{ fontSize: fontSize * 2 + 50 }} >Hello World Hello World Hello World Hello World 2</h1>
      </div>
    );
  }
}