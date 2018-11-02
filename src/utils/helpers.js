

export const createAsyncSubmit = (onAccept, onCancel) => async (...args) => {
  const result = await onAccept(...args);
  if (result) onCancel(result);
  return result;
};
