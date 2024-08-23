import React, { useState } from 'react';
import { z } from 'zod';
import { strings } from '../../strings';
import { isValidDomain } from '../../helpers/isValidDomain';

import { Button, Input, StatusInfo } from '../';
import styles from './SignForm.module.css';

const authSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine((email) => isValidDomain(email), { message: 'Invalid email domain' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const SignForm = ({ handleSignIn, handleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors.map((err) => err.message).join(', '));
      return false;
    }
    setError('');
    return true;
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
