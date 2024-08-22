import React, { useState } from 'react';
import { strings } from '../../strings';
import { Button, Input, StatusInfo } from '../';
import styles from './SignForm.module.css';

const SignForm = ({ handleSignIn, handleSignUp, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp(e, email, password);
    } else {
      handleSignIn(e, email, password);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>{strings.welcome}</h2>
      <div className={styles.formContainer}>
        {isSignUp ? (
          <p>
            {strings.doHaveAccount}{' '}
            <span onClick={() => setIsSignUp(false)} className={styles.link}>
              {strings.signIn}
            </span>
          </p>
        ) : (
          <p>
            {strings.notHaveAccount}{' '}
            <span onClick={() => setIsSignUp(true)} className={styles.link}>
              {strings.signUp}
            </span>
          </p>
        )}
      </div>
      <Input
        label={strings.email}
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
        label={strings.password}
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
        {isSignUp ? strings.signUp : strings.signIn}
      </Button>
      {error && <StatusInfo status="fail">{error}</StatusInfo>}
    </form>
  );
};

export default SignForm;
