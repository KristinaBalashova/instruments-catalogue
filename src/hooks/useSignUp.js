import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useSignUp = (setConfirmationCheck) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (email, password) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://kristinabalashova.github.io/instruments-catalogue/',
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setConfirmationCheck(true);
    }
    setLoading(false);
  };

  return { handleSignUp, loading, error };
};

export default useSignUp;
