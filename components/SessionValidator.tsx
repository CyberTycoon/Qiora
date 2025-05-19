// components/SessionValidator.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { createClient } from '@/utils/supabase/client';

export default function SessionValidator() {
  const { session } = useAuth();
  const validationRunning = useRef(false);
  const lastValidation = useRef(0);
  const supabase = createClient();

  useEffect(() => {
    // Function to validate the session and refresh token if needed
    const validateSession = async () => {
      // Prevent multiple validations running at once
      if (validationRunning.current) return;
      
      // Only validate every 5 minutes at most
      const now = Date.now();
      if (now - lastValidation.current < 5 * 60 * 1000) return;
      
      validationRunning.current = true;
      lastValidation.current = now;
      
      try {
        console.log('Validating session...');
        
        if (!session) {
          console.log('No session to validate');
          return;
        }
        
        // Get the current time in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check if session is expired or will expire in the next 30 minutes
        if (session.expires_at && session.expires_at - currentTime < 30 * 60) {
          console.log('Session is expiring soon, refreshing token...');
          
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('Error refreshing token:', error);
          } else {
            console.log('Token refreshed successfully');
          }
        } else {
          console.log('Session is valid and not expiring soon');
        }
      } catch (error) {
        console.error('Error validating session:', error);
      } finally {
        validationRunning.current = false;
      }
    };
    
    // Validate when the component mounts
    validateSession();
    
    // Set up interval to periodically validate (every 5 minutes)
    const interval = setInterval(validateSession, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [session, supabase]);
  
  // This component doesn't render anything visible
  return null;
}