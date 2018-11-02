import React from 'react';
import _ from 'lodash';
import { Header, Modal, Button } from 'semantic-ui-react';
import { ConfirmModal } from './confirmModal';


/*options: {
  size : string,
  className: string,
  actions: { accept: true, cancel: { ...btnProps }, extra: () => {} },
  content: string || <></>
  header:  string || <></>
  body: string || <></>
  custom: <Component onClose={(err, result) => {}} />
} */
export const showModal = (options) => (dispatch) => new Promise((res, rej) => {
  const modalId = _.uniqueId();

  const onClose = (err, result) => {
    if (err)
      rej(err);
    else
      res(result);

    dispatch({ type: 'DESTROY_MODAL', id: modalId });
  };

  dispatch({ type: 'SHOW_MODAL', id: modalId, onClose, options });
});

export const showSuccess = ({ content, header = 'Operación realizada', size = 'tiny' }) => showModal({
  body: (
    <>
      <Header icon='checkmark' content={header} />
      <Modal.Content>
        {content}
      </Modal.Content>
    </>
  ),
  size,
  actions: { accept: <Button positive icon='checkmark' content='Aceptar' /> }
});

export const showError = ({ content, header = 'Operación fallida', size = 'tiny' }) => showModal({
  body: (
    <>
      <Header icon='close' content={header} />
      <Modal.Content>
        {content}
      </Modal.Content>
    </>
  ),
  size,
  actions: { accept: <Button negative content='Aceptar' /> }
});

export const showWarning = ({ content, header = 'Operación realizada con algunos problemas', size = 'tiny' }) => showModal({
  body: (
    <>
      <Header icon='exclamation' content={header} />
      <Modal.Content>
        {content}
      </Modal.Content>
    </>
  ),
  size,
  actions: { accept: <Button color='yellow' content='Aceptar' /> }
});


export const showConfirm = ({ onAccept, onCancel, cancelText, acceptText, content, options, header = 'Confirme operación', size = 'tiny' }) => showModal({
  custom: ConfirmModal,
  onAccept,
  onCancel,
  content,
  header,
  size,
  options,
  cancelText,
  acceptText
});

