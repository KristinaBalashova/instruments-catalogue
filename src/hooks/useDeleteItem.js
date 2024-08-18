import { useState } from 'react';
import { supabase } from '../supabaseClient';

const useDeleteItem = () => {
  const [statusDelete, setStatusDelete] = useState(null);
  const [errorDelete, setErrorDelete] = useState(false);

  const deleteItem = async (table, id, onSuccess) => {
    try {
      // Start a transaction
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorites')
        .delete()
        .eq('item_id', id);

      if (favoriteError) throw favoriteError;

      const { error } = await supabase.from('instruments_collection').delete().eq('id', id);

      if (error) throw error;

      setStatusDelete(true);
      if (onSuccess) onSuccess(id);

      setTimeout(() => {
        setStatusDelete(null);
      }, 2000);
    } catch (error) {
      console.error('Error deleting data:', error);
      setStatusDelete(false);
      setErrorDelete('Error deleting data');
    }
  };

  return {
    deleteItem,
    statusDelete,
    errorDelete,
  };
};

export default useDeleteItem;
