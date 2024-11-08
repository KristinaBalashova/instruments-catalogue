import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useResendConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResend = async (email) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) setError(error.message);
    setLoading(false);
  };

  return { handleResend, loading, error };
};

export default useResendConfirmation;
