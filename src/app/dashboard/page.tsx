'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/components/Analytics';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to access the dashboard');
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.id) {
      toast.success('Welcome to your dashboard!');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (!session?.user?.id) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400">Error: User ID not found</div>
        <button
          onClick={() => router.refresh()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Threat Intelligence Analytics</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <Analytics userId={session.user.id} />
      </div>
    </div>
  );
} 