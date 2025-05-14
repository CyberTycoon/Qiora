'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // This effect runs once when the component mounts
    const handleCallback = async () => {
      try {
        // The magic happens here - Supabase automatically processes the auth callback
        // from the URL parameters that were added by the OAuth provider
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // If we get here, the auth was successful
        // Now we can redirect to the dashboard
        router.push('/dashboard');
        
      } catch (error) {
        router.push('/auth/sign-in');
      }
    };
    
    handleCallback();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <p>Completing authentication, please wait...</p>
      </main>
    </div>
  );
}