import { useQuery } from "@tanstack/react-query";
import { supabase } from "../helpers/supabaseClient";

const useUpdateItem = (id, updatedItem) => {
  return useQuery({
    queryKey: ["updateItem", id],
    queryFn: async () => {
        const { data, error } = await supabase
          .from('instruments_collection')
          .update(updatedItem)
          .eq('id', id);

      if (error) throw error;
    },
  });
};

export default useUpdateItem;