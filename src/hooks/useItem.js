import { useQuery } from "@tanstack/react-query";
import { supabase } from "../helpers/supabaseClient";

const useItem = (id) => {
  return useQuery({
    queryKey: ["instrument", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments_collection")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export default useItem;
