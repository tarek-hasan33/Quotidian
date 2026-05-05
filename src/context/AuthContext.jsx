import { createContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({ user, loading, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
