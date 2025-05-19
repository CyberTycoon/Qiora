// components/AuthProvider.tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  
  // Use a ref to track if we're currently handling an auth state change
  const handlingAuthChange = useRef(false);
  // Use a ref to track if the user manually signed out
  const manualSignOut = useRef(false);

  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }

        console.log('Initial session check:', !!initialSession, initialSession?.user?.email);
        
        if (initialSession && mounted) {
          setSession(initialSession);
          setUser(initialSession.user);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log(`Auth state changed: ${event}`, !!newSession, newSession?.user?.email);
            
            // Only update state if the component is still mounted
            if (!mounted) return;
            
            // If we're handling an auth change already, skip to prevent loops
            if (handlingAuthChange.current && event === 'SIGNED_OUT') {
              console.log('Ignoring duplicate SIGNED_OUT event');
              return;
            }
            
            handlingAuthChange.current = true;
            
            try {
              if (event === 'SIGNED_IN' && newSession) {
                console.log('User signed in successfully');
                setSession(newSession);
                setUser(newSession.user);
              } else if (event === 'SIGNED_OUT') {
                // Only process sign out if it was manually triggered or we don't have a session
                if (manualSignOut.current || (!user && !session)) {
                  console.log('User signed out (manual or initial)');
                  setSession(null);
                  setUser(null);
                  
                  if (manualSignOut.current) {
                    // Reset manual sign out flag
                    manualSignOut.current = false;
                  }
                } else {
                  // This may be an unexpected sign-out, check if the session is actually valid
                  console.log('Unexpected SIGNED_OUT event detected, validating session...');
                  
                  // Double-check if we actually have a valid session
                  const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                  
                  if (error) {
                    console.error('Error re-checking session:', error);
                    return;
                  }
                  
                  if (currentSession) {
                    // If we still have a valid session, keep the user signed in
                    console.log('Valid session found, keeping user signed in');
                    setSession(currentSession);
                    setUser(currentSession.user);
                  } else {
                    // No valid session found, user is truly signed out
                    console.log('No valid session found, user is confirmed signed out');
                    setSession(null);
                    setUser(null);
                  }
                }
              } else if (event === 'TOKEN_REFRESHED' && newSession) {
                console.log('Token refreshed');
                setSession(newSession);
                setUser(newSession.user);
              }
            } finally {
              handlingAuthChange.current = false;
            }
          }
        );
        
        // Authentication setup is complete
        if (mounted) setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error in auth setup:', err);
        if (mounted) setIsLoading(false);
      }
    };

    setupAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const signOut = async () => {
    try {
      // Set the manual sign out flag to true
      manualSignOut.current = true;
      await supabase.auth.signOut();
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      // Reset the flag if sign out fails
      manualSignOut.current = false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);