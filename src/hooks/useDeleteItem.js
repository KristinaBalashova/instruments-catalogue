import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useDeleteItem = () => {
  const [errorDelete, setErrorDelete] = useState(false);

  const deleteItem = async (id, onSuccess) => {
    console.log(id, 'id');
    try {
      const { error: favoriteError } = await supabase.from('favorites').delete().eq('item_id', id);

      if (favoriteError) throw favoriteError;

      const { error } = await supabase.from('instruments_collection').delete().eq('id', id);

      if (error) throw error;
      if (onSuccess) onSuccess(id);
    } catch (error) {
      console.error('Error deleting data:', error);
      setErrorDelete('Error deleting data');
    }
  };

  return {
    deleteItem,
    errorDelete,
  };
};

export default useDeleteItem;
