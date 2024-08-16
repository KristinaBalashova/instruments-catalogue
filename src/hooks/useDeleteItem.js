import { useState } from 'react';
import { supabase } from '../supabaseClient';

const useDeleteItem = () => {
  const [statusDelete, setStatusDelete] = useState(null);
  const [errorDelete, setErrorDelete] = useState(false);

  const deleteItem = async (table, id, onSuccess) => {
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      console.log(error);
      setStatusDelete(false);
      setErrorDelete('Error deleting data');
    } else {
      setStatusDelete(true);
      if (onSuccess) onSuccess(id);

      setTimeout(() => {
        setStatusDelete(null);
      }, 2000);
    }
  };

  return {
    deleteItem,
    statusDelete,
    errorDelete,
  };
};

export default useDeleteItem;
