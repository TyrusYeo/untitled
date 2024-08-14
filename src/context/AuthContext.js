'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // Adjust this import path accordingly

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const session = await getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      // listener?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return session;
}