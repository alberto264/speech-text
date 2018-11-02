import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Joi from 'joi';
import { createSelector } from 'reselect';
import { Form } from 'semantic-ui-react';

export class Fieldset extends PureComponent {

  static propTypes = {
    source: PropTypes.object,
    schema: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    cloneSource: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    useFormTag: PropTypes.bool,
  }

  static defaultProps = {
    source: {},
    enabled: true,
    useFormTag: true,
    cloneSource: _.cloneDeep
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.source !== prevState.lastSource || nextProps.enabled !== prevState.lastEnabled)
      return {
        errors: {},
        source: nextProps.cloneSource(nextProps.source),
        lastEnabled: nextProps.enabled,
        lastSource: nextProps.source
      };
    return null;
  }

  constructor(props) {
    super(props);
    this.isUnmounted = false;
    this.state = { loading: false, doBrowserSubmit: false, lastEnabled: null, lastSource: null };
  }
  resetSource = () => {
    this.setState({ source: this.props.cloneSource(this.props.source), errors: {} });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  submitForm = async(e) => {
    const { schema, onSubmit } = this.props;
    let { source } = this.state;

    _.invoke(e, 'preventDefault');

    this.setState({ loading: true, errors: {} });

    const { error, value: newObj } = Joi.validate(source, schema, { abortEarly: false, allowUnknown: true });

    if (error) {
      console.warn('validation failed', error.details);
      const errors = _.transform(error.details, (errors, { path: [key], message }) => errors[key] = message, {});
      this.setState({ errors, loading: false });
      return false;
    }

    source = _.pickBy(newObj, _.negate(_.isUndefined));

    const success = await onSubmit(source);

    if (success && !this.isUnmounted)
      this.setState({ source: this.props.cloneSource(this.props.source) });
    if (!this.isUnmounted)
      this.setState({ loading: false });

    return success;
  }

  onChange = (prop, value, { value: maybeValue, checked: maybeValue2 } = {}) => {
    const newVal = _.has(value, 'target.value')
      ? value.target.value
      : _.has(value, 'target.checked')
        ? value.target.checked
        : !_.isUndefined(maybeValue) ? maybeValue : (!_.isUndefined(maybeValue2) ? maybeValue2 : value);
    this.setState((prevState) => {
      prevState.source[prop] = newVal;
      return ({ source: prevState.source, errors: { ...prevState.errors, [prop]: '' } });
    });
    return true;
  }


  calculateProps = createSelector(
    createSelector((state, props) => props.schema, (schema) => _.mapValues(schema, (val, key) => _.partial(this.onChange, key))),
    (state) => state.errors,
    (state) => state.source,
    (state, props) => props.enabled,
    (schemaOnChange, errors, source, enabled) => _.mapValues(schemaOnChange, (onChangeProp, key) => ({
      message: errors[key] || '',
      errored: !!errors[key],
      value: source[key],
      onChange: enabled ? onChangeProp : _.noop,
    }))
  );

  render() {
    const { loading } = this.state;
    const { children, enabled, useFormTag } = this.props;

    const extraProps = _.pickBy(_.omit(this.props, _.keys(Fieldset.propTypes)), _.identity);
    const props = this.calculateProps(this.state, this.props);
    const Component = (!useFormTag || parent) ? 'div' : Form;

    return (
      <Component onSubmit={(!useFormTag || !enabled) ? undefined : this.submitForm} {...extraProps} >
        {children(props, { submitForm: enabled ? this.submitForm : _.noop, resetSource: this.resetSource, loading })}
      </Component>
    );
  }

}