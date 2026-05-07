"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [token, mounted, router, pathname]);

  if (!mounted || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin-slow">radar</span>
          <p className="font-data-mono text-primary animate-pulse">AUTHENTICATING SECURE NODE...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
