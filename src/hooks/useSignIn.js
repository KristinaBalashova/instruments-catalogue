import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (email, password) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return { handleSignIn, loading, error };
};

export default useSignIn;
