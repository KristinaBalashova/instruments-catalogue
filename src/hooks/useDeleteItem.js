import { useState } from 'react';
import { supabase } from '../helpers/supabaseClient';

const useDeleteItem = () => {
  const [errorDelete, setErrorDelete] = useState(false);

  const deleteItem = async (id, onSuccess) => {
    try {
      const { data: imageData, error: filePathErr } = await supabase
        .from('instruments_collection')
        .select('image')
        .eq('id', id)
        .maybeSingle();

      if (filePathErr) throw filePathErr;

      let imagePath = imageData?.image;
      if (imagePath) {
        const urlParts = imageData.image.split('/pics/');
        imagePath = urlParts[1].split('?')[0];
      }

      const { error: favoriteError } = await supabase.from('favorites').delete().eq('item_id', id);
      if (favoriteError) throw favoriteError;

      const { error: deleteError } = await supabase
        .from('instruments_collection')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;

      if (imagePath) {
        const { error: storageErr } = await supabase.storage.from('pics').remove([imagePath]);
        if (storageErr) throw storageErr;
      }

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
