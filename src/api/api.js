import { supabase } from '../helpers/supabaseClient';

export const getSession = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  return { session, sessionError };
};

export const getUser = async () => {
  const {
    data: { user: supabaseUser },
    error: userError,
  } = await supabase.auth.getUser();

  return { supabaseUser, userError };
};

export const getUserData = async (id) => {
  const { data, error } = await supabase.from('users').select('id, role').eq('id', id).maybeSingle();
  return { data, error };
};

export const getFavorites = async (id) => {
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('item_id')
    .eq('user_id', id);
  return { favorites, favError };
};

export const deleteFavItem = async (item_id, user_id) => {
  const { error: deleteError } = await supabase
    .from('favorites')
    .delete()
    .match({ item_id: item_id, user_id: user_id });
  return { deleteError };
};

export const insertFavItem = async (item) => {
  const { incertError } = await supabase.from('favorites').insert(item);
  return { incertError };
};
