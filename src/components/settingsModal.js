import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet/es/Helmet';
import Joi from 'joi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Button, Modal, Input } from 'semantic-ui-react';

import { Fieldset, Popup } from 'controls';
import { createAsyncSubmit } from 'utils/helpers';
import { saveSettings } from 'actions';


const settingsTemplate = { key: '', region: '' };
const settingsSchema = {
  key: Joi.string().trim().required().max(50).label('Key'),
  region: Joi.string().trim().required().max(50).label('Region'),
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ saveSettings }, dispatch);

@connect(undefined, mapDispatchToProps)
export class SettingsModal extends PureComponent {

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired
  }

  onSubmit = createAsyncSubmit(this.props.saveSettings, this.props.onCancel);

  render() {
    const { onCancel } = this.props;

    return (
      <Fieldset useFormTag={false} schema={settingsSchema} source={settingsTemplate} onSubmit={this.onSubmit}>
        {({ key, region }, { loading, submitForm }) => (
          <Modal size='tiny' onClose={onCancel} open closeOnDimmerClick={false} closeIcon={false} >
            <Helmet title='Speech settings' />
            <Modal.Header content='Settings' />
            <Modal.Content as={Form} >
              <Form.Field error={key.errored} required >
                <label>Key</label>
                <Popup message={key.message} enabled={key.errored} >
                  <Input value={key.value || ''} onChange={key.onChange} autoComplete='off' />
                </Popup>
              </Form.Field>
              <Form.Field error={region.errored} required >
                <label>Region</label>
                <Popup message={region.message} enabled={region.errored} >
                  <Input value={region.value || ''} onChange={region.onChange} autoComplete='off' />
                </Popup>
              </Form.Field>
            </Modal.Content>
            <Modal.Actions>
              <Button disabled={loading} loading={loading} secondary content='Cancel' onClick={onCancel} />
              <Button onClick={submitForm} disabled={loading} loading={loading} primary icon='right chevron' labelPosition='right' content='Save' />
            </Modal.Actions>
          </Modal>
        )}
      </ Fieldset>
    );
  }

}

