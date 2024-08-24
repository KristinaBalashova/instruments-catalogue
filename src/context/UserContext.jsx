import { useState, useEffect, createContext } from 'react';
import { supabase } from '../helpers/supabaseClient';
import { getUserData } from '../api/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) throw error;

          if (data) {
            setUser({
              id: session.user.id,
              role: data.role,
              email: session.user.email,
            });
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const fetchUserData = async () => {
        if (session) {
          const { data, error } = await getUserData(session.user.id);

          if (error) throw error;

          if (data) {
            setUser({
              id: session.user.id,
              role: data.role,
              email: session.user.email,
            });
          }
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
