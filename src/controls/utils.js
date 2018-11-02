import _ from 'lodash';

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const getValue = (value, mapping = {}, defaultValue) => _.get(mapping, `[${value}]`, defaultValue);
export const debounceCall = (method, delay = 250) => {
  let timeout = null;
  let items = [];
  return (arg1) => {
    items.push(arg1);
    clearTimeout(timeout);
    timeout = setTimeout(() => { method(items); items = []; }, delay);
  };
};
