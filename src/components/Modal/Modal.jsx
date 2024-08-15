import React from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.css';

const Modal = ({ isOpen = false, onClose, children, header }) => {
  ReactModal.setAppElement('#root');
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={200}
      overlayClassName={styles.overlay}
      className={styles.root}
    >
      <div className={styles.container}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={styles.closeButton}
          data-testid="modal-close-button"
        >
          <img src="/icon-close.svg" className={styles.closeIcon} alt="close" />
        </button>
        {header ? <div className={styles.header}>{header}</div> : null}
        <div className={styles.content}>{children}</div>
      </div>
    </ReactModal>
  );
};

export default Modal;
