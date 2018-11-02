import React, { PureComponent } from 'react';
import { Icon } from 'semantic-ui-react';

import { SettingsModal } from './settingsModal';

export class Home extends PureComponent {

  state = { visible: false }

  showSettings = () => this.setState({ visible: true });
  hideSettings = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;

    return (
      <div className='min-vh-100 w-100'>
        <Icon className='absolute top-1 right-1' size='large' link name='cog' color='grey' onClick={this.showSettings} />
        { visible && <SettingsModal onCancel={this.hideSettings} /> }
      </div>
    );
  }

}