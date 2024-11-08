import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    setLoading(false);
  };

  return { handleSignOut, loading, error };
};

export default useSignOut;
