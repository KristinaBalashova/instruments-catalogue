import { supabase } from '../helpers/supabaseClient';

export const getUser = async () => {
  const {
    data: { user: supabaseUser },
    error: userError,
  } = await supabase.auth.getUser();

  return { supabaseUser, userError };
};

export const getUserData = async (id) => {
  const { data, error } = await supabase.from('users').select('id, role').eq('id', id).single();

  return { data, error };
};
