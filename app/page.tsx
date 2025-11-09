'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to authorities dashboard on load
    router.push('/authorities');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-pulse shadow-2xl">
          🚀
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Vision IA Admin</h1>
        <p className="text-slate-300">Loading authorities dashboard...</p>
      </div>
    </div>
  );
}
