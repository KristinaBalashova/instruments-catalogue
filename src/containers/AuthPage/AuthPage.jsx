import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context';
import toast from 'react-hot-toast';

import useSignIn from '../../hooks/useSignIn';
import useSignUp from '../../hooks/useSignUp';
import useSignOut from '../../hooks/useSignOut';
import useResendConfirmation from '../../hooks/useResendConfirmation';

import { UserDashboard, SignForm, Loader, SectionLayout, CredentialsCard } from '../../components';
import ConfirmationCheck from '../../components/ConfirmationCheck/ConfirmationCheck';

import styles from './AuthPage.module.css';

const AuthPage = () => {
  const { user } = useContext(UserContext);

  const [confirmationCheck, setConfirmationCheck] = useState(false);

  const { handleSignIn, loading: signInLoading, error: signInError } = useSignIn();
  const {
    handleSignUp,
    loading: signUpLoading,
    error: signUpError,
  } = useSignUp(setConfirmationCheck);
  const { handleSignOut, loading: signOutLoading, error: signOutError } = useSignOut();
  const { handleResend, loading: resendLoading, error: resendError } = useResendConfirmation();

  useEffect(() => {
    if (signInError) toast.error(`Sign-in failed: ${signInError}`);
    if (signUpError) toast.error(`Sign-up failed: ${signUpError}`);
    if (signOutError) toast.error(`Sign-out failed: ${signOutError}`);
    if (resendError) toast.error(`Resend confirmation failed: ${resendError}`);
  }, [signInError, signUpError, signOutError, resendError]);

  return (
    <SectionLayout>
      <div className={styles.container}>
        {(signInLoading || signUpLoading || signOutLoading || resendLoading) && <Loader />}

        {!user && !confirmationCheck && (
          <div className={styles.authWrapper}>
            <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
            <CredentialsCard />
          </div>
        )}

        {confirmationCheck && !user && <ConfirmationCheck handleResend={handleResend} />}

        {user && <UserDashboard user={user} handleSignOut={handleSignOut} />}
      </div>
    </SectionLayout>
  );
};

export default AuthPage;
