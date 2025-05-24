'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThreatInputForm } from '@/components/ThreatInputForm';
import { ThreatResults } from '@/components/ThreatResults';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Threat Intelligence Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">New Lookup</h2>
          <ThreatInputForm 
            onResults={setResults}
            onLoading={setLoading}
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {loading ? (
            <div>Analyzing threat data...</div>
          ) : results ? (
            <ThreatResults results={results} />
          ) : (
            <div>Enter a query to see results</div>
          )}
        </div>
      </div>
    </div>
  );
} 