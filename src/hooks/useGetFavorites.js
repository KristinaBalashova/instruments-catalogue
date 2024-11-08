import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabaseClient';
import { getFavorites } from '../api/api';
import { UserContext } from '../context';

const useGetFavorites = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const { favorites, favError } = await getFavorites(user?.id);

        if (favError) {
          setError(favError);
          setLoading(false);
          return;
        }

        const itemIds = favorites.map((fav) => fav.item_id);

        if (itemIds.length > 0) {
          const { data: items, error: itemsError } = await supabase
            .from('instruments_collection')
            .select('id, name, image')
            .in('id', itemIds);

          if (itemsError) {
            setError(itemsError);
          } else {
            setData(items);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchFavorites();
  }, [user]);

  return { data, loading, error, reload: getFavorites };
};

export default useGetFavorites;
