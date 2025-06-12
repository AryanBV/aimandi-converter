'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/?error=auth_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/?auth=success');
        } else {
          // No session found
          router.push('/?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        router.push('/?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold mb-2">Completing Sign In...</h2>
        <p className="text-[#b8b8d1]">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}