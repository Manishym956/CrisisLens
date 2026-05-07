"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleSuccess = async (credentialResponse: any) => {
    const loadingToast = toast.loading('Authenticating node...');
    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/google', {
        token: credentialResponse.credential,
      });
      
      const { access_token, user } = res.data;
      setAuth(access_token, user);
      
      toast.success('Access Granted.', { id: loadingToast });
      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      toast.error('Authentication Failed. Threat Level elevated.', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 hero-gradient">
      <div className="glass-panel p-xl rounded-2xl max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container via-surface to-background opacity-50"></div>
        </div>
        
        <div className="relative z-10 space-y-lg">
          <div className="flex flex-col items-center gap-xs">
            <div className="w-16 h-16 rounded-xl bg-primary-container/20 flex items-center justify-center border border-primary/30 mb-sm">
              <span className="material-symbols-outlined text-primary text-4xl">security</span>
            </div>
            <h1 className="font-h1 text-h2 text-on-surface leading-tight">Secure Access</h1>
            <p className="font-data-mono text-label-sm text-primary uppercase tracking-widest">CrisisLens Intelligence Network</p>
          </div>
          
          <div className="space-y-sm text-left">
            <p className="text-body-md text-on-surface-variant text-center px-sm">
              Authentication required to access the predictive matrix and global threat feeds.
            </p>
          </div>

          <div className="pt-sm flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                toast.error('Login Failed');
              }}
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>
          
          <p className="text-[10px] text-on-surface-variant font-data-mono mt-xl">
            NODE_CONNECTION_SECURE // AES-256 ENCRYPTED
          </p>
        </div>
      </div>
    </div>
  );
}
