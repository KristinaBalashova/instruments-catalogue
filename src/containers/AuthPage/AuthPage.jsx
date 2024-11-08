import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context';
import { STATUS_FAIL } from '../../strings';

import { useSignIn, useSignUp, useSignOut, useResendConfirmation } from '../../hooks';
import { UserDashboard, SignForm, StatusInfo, Loader, SectionLayout } from '../../components';
import ConfirmationCheck from '../../components/ConfirmationCheck/ConfirmationCheck';

import styles from './AuthPage.module.css';

const AuthPage = () => {
  const { user, setUser } = useContext(UserContext);

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
    if (confirmationCheck) {
      const interval = setInterval(async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user && data.user.email_confirmed_at) {
          setUser(data.user);
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [confirmationCheck, setUser]);

  return (
    <SectionLayout>
      <div className={styles.container}>
        {(signInLoading || signUpLoading || signOutLoading || resendLoading) && <Loader />}
        {!user && !confirmationCheck && (
          <SignForm handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
        )}
        {confirmationCheck && !user && <ConfirmationCheck handleResend={handleResend} />}
        {user && <UserDashboard user={user} handleSignOut={handleSignOut} />}
        {signInError && <StatusInfo status={STATUS_FAIL}>{signInError}</StatusInfo>}
        {signUpError && <StatusInfo status={STATUS_FAIL}>{signUpError}</StatusInfo>}
        {signOutError && <StatusInfo status={STATUS_FAIL}>{signOutError}</StatusInfo>}
        {resendError && <StatusInfo status={STATUS_FAIL}>{resendError}</StatusInfo>}
      </div>
    </SectionLayout>
  );
};

export default AuthPage;
