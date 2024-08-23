import React from 'react';
import { Link } from 'react-router-dom';
import { USER_MESSAGES } from '../../strings';
import { Button } from '../../components';
import styles from './ConfirmationCheck.module.css';
import { BiSolidHomeAlt2 } from 'react-icons/bi';

const ConfirmationCheck = (handleResend) => {
  return (
    <div className={styles.container}>
      <p>{USER_MESSAGES.CONFIRMATION_CHECK}</p>
      <Button secondary onClick={() => handleResend(email)}>
        {USER_MESSAGES.RESEND}
      </Button>
      <Link to="/" className={styles.link}>
        <BiSolidHomeAlt2 />
        {USER_MESSAGES.RETURN}
      </Link>
    </div>
  );
};

export default ConfirmationCheck;
