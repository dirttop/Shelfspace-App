import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../app/lib/supabase';
import * as Linking from 'expo-linking';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Handle deep linking for Supabase auto-login
    const handleDeepLink = async (event: { url: string }) => {
      if (!event.url) return;

      try {
        const parsedUrl = Linking.parse(event.url);
        const queryParams = parsedUrl.queryParams;

        if (queryParams && queryParams.code) {
          // Handle PKCE flow
          await supabase.auth.exchangeCodeForSession(queryParams.code as string);
        } else if (event.url.includes('#access_token=')) {
          // Handle implicit flow (fallback)
          const hashMatch = event.url.match(/#access_token=([^&]+)/);
          const refreshMatch = event.url.match(/&refresh_token=([^&]+)/);
          if (hashMatch && refreshMatch) {
            await supabase.auth.setSession({
              access_token: hashMatch[1],
              refresh_token: refreshMatch[1],
            });
          }
        }
      } catch (e) {
        console.error("Deep link handling error", e);
      }
    };

    const linkSubscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.unsubscribe();
      linkSubscription.remove();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
