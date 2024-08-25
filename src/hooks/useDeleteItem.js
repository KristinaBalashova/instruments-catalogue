import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useDeleteItem = () => {
  const [errorDelete, setErrorDelete] = useState(false);

  const deleteItem = async (id, onSuccess) => {
    try {
      const { error: favoriteError } = await supabase.from('favorites').delete().eq('item_id', id);

      if (favoriteError) throw favoriteError;

      const { error } = await supabase.from('instruments_collection').delete().eq('id', id);

      if (error) throw error;
      if (onSuccess) onSuccess(id);
    } catch (error) {
      setErrorDelete(error.message);
    }
  };

  return {
    deleteItem,
    errorDelete,
  };
};

export default useDeleteItem;
