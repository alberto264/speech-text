import _ from 'lodash';
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


const settingsTemplate = { key: '', region: '', language: '' };
const settingsSchema = {
  key: Joi.string().trim().required().max(50).label('Key'),
  region: Joi.string().trim().required().max(50).label('Region'),
  language: Joi.string().required().max(10).label('Language')
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ saveSettings }, dispatch);
const mapStateToProps = (state) => ({ settings: state.settings });


@connect(mapStateToProps, mapDispatchToProps)
export class SettingsModal extends PureComponent {

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    settings: PropTypes.object,
  }

  onSubmit = createAsyncSubmit(this.props.saveSettings, this.props.onCancel);

  render() {
    const { onCancel, settings } = this.props;

    return (
      <Fieldset useFormTag={false} schema={settingsSchema} source={_.isEmpty(settings) ? settingsTemplate : settings} onSubmit={this.onSubmit} >
        {({ key, region, language }, { loading, submitForm }) => (
          <Modal size='tiny' onClose={onCancel} open closeOnDimmerClick={false} closeIcon={false} >
            <Helmet title='Settings' />
            <Modal.Header content='Settings' />
            <Modal.Content as={Form} >
              <Form.Field error={key.errored} required >
                <label>Azure Key</label>
                <Popup message={key.message} enabled={key.errored} >
                  <Input value={key.value || ''} onChange={key.onChange} autoComplete='off' />
                </Popup>
              </Form.Field>
              <Form.Field error={region.errored} required >
                <label>Azure Region</label>
                <Popup message={region.message} enabled={region.errored} >
                  <Input value={region.value || ''} onChange={region.onChange} autoComplete='off' />
                </Popup>
              </Form.Field>
              <Form.Field error={language.errored} required >
                <label>Language</label>
                <Popup message={language.message} enabled={language.errored} >
                  <Input value={language.value || ''} onChange={language.onChange} autoComplete='on' />
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

