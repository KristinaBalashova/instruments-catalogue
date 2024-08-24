import { useState, useEffect, createContext } from 'react';
import { supabase } from '../helpers/supabaseClient';
import { getUserData, getSession } from '../api/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionAndSetUser = async () => {
      try {
        const { session, sessionError } = await getSession();

        if (sessionError) throw sessionError;

        if (session) {
          const { data } = await getUserData(session.user.id);
          setUser({
            id: session.user.id,
            role: data?.role || 'reader',
            email: session.user.email,
          });
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSessionAndSetUser();
  }, []);

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const fetchUserData = async () => {
        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) {
            console.log(error.message);
          }

          setUser({
            id: session.user.id,
            role: data?.role || 'reader',
            email: session.user.email,
          });
        }
      };
      fetchUserData();
    }
    if (event === 'SIGNED_OUT') {
      setUser(null);
    }
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
