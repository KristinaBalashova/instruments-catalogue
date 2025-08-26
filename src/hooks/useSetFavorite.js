import { useState, useEffect, useContext } from 'react';
import { getFavorites, deleteFavItem, insertFavItem } from '../api/api';
import { UserContext } from '../context';
import { USER_MESSAGES } from '../strings';

const useSetFavorite = (itemId) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user || !itemId) return;
    
    const fetchFavoriteStatus = async () => {
      setLoading(true);
      try {
        const { favorites, favError } = await getFavorites(user.id);
        if (favError) throw favError;

        const favoriteCardIds = favorites.map((item) => item.item_id);
        setIsFavorite(favoriteCardIds.includes(itemId));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteStatus();
  }, [user, itemId]);

  const handleSetFavorite = async () => {
    if (!user) {
      alert(USER_MESSAGES.LOGIN_TO_ADD_FAVS);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      if (isFavorite) {
        const { deleteError } = await deleteFavItem(itemId, user.id);
        if (deleteError) throw deleteError;
      } else {
        const { insertError } = await insertFavItem({ item_id: itemId, user_id: user.id });
        if (insertError) throw insertError;
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, error, handleSetFavorite };
};

export default useSetFavorite;
