import { useState } from 'react';
import * as yup from 'yup';
import { USER_MESSAGES, STATUS_FAIL } from '../../strings';
import { isValidDomain } from '../../helpers/isValidDomain';

import { Button, Input, StatusInfo } from '../ui';

import styles from './SignForm.module.css';

const authSchema = yup.object({
  email: yup
    .string()
    .email(USER_MESSAGES.VALIDATION.INVALID_EMAIL)
    .test(
      'valid-domain',
      USER_MESSAGES.VALIDATION.INVALID_DOMAIN,
      (email) => (email ? isValidDomain(email) : false)
    ),
  password: yup
    .string()
    .min(6, USER_MESSAGES.VALIDATION.INVALID_PASSWORD),
});

const SignForm = ({ handleSignIn, handleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const validateForm = () => {
    try {
      authSchema.validateSync({ email, password });
      setError('');
      return true;
    } catch (err) {
      setError(err.errors.map((error) => error.message).join(', '));
      return false;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isSignUp) {
        handleSignUp(email, password, setError);
      } else {
        handleSignIn(email, password, setError);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.title}>{USER_MESSAGES.WELCOME}</h2>
      <div className={styles.container}>
        {isSignUp ? (
          <p>
            {USER_MESSAGES.DO_HAVE_ACCOUNT}{' '}
            <span onClick={() => setIsSignUp(false)} className={styles.link}>
              {USER_MESSAGES.SIGN_IN}
            </span>
          </p>
        ) : (
          <p>
            {USER_MESSAGES.NOT_HAVE_ACCOUNT}{' '}
            <span onClick={() => setIsSignUp(true)} className={styles.link}>
              {USER_MESSAGES.SIGN_UP}
            </span>
          </p>
        )}
      </div>
      <Input
        label={USER_MESSAGES.EMAIL}
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={error}
        placeholder="email"
        autoComplete="email"
      />
      <Input
        label={USER_MESSAGES.PASSWORD}
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error}
        placeholder="password"
        autoComplete="current-password"
      />
      <Button primary type="submit">
        {isSignUp ? USER_MESSAGES.SIGN_UP : USER_MESSAGES.SIGN_IN}
      </Button>
      {error && <StatusInfo status={STATUS_FAIL}>{error}</StatusInfo>}
    </form>
  );
};

export default SignForm;
