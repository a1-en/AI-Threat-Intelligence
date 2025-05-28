'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

type QueryType = 'ip' | 'domain' | 'hash' | 'url';

interface ThreatInputFormProps {
  onResults: (results: any) => void;
  onLoading: (loading: boolean) => void;
}

export function ThreatInputForm({ onResults, onLoading }: ThreatInputFormProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('ip');
  const [error, setError] = useState('');

  const validateInput = () => {
    if (queryType === 'ip') {
      // Simple IPv4/IPv6 regex
      const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
      return ipRegex.test(query.trim());
    }
    if (queryType === 'domain') {
      // Simple domain regex
      const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,6}$/;
      return domainRegex.test(query.trim());
    }
    if (queryType === 'hash') {
      // MD5, SHA1, SHA256
      const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;
      return hashRegex.test(query.trim());
    }
    if (queryType === 'url') {
      // Simple URL regex
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;
      return urlRegex.test(query.trim());
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input validation for type
    if (!validateInput()) {
      setError('Please select the correct type for your input.');
      return;
    }

    // If not authenticated, show prompt
    if (!session) {
      setError('Please login or register an account.');
      return;
    }

    onLoading(true);

    try {
      const response = await fetch('/api/threat/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          queryType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          setError('You have reached your daily limit of 10 searches. Please try again tomorrow.');
          onLoading(false);
          return;
        }
        throw new Error(error.message || 'Failed to fetch threat data');
      }

      const data = await response.json();
      onResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
      <div className="space-y-2">
        <label htmlFor="queryType" className="block text-sm font-medium text-gray-200">
          Query Type
        </label>
        <div className="relative">
          <select
            id="queryType"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as QueryType)}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="ip">IP Address</option>
            <option value="domain">Domain</option>
            <option value="hash">File Hash</option>
            <option value="url">URL</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="query" className="block text-sm font-medium text-gray-200">
          Query
        </label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder={`Enter ${queryType === 'ip' ? 'IP address' : queryType === 'domain' ? 'domain' : queryType === 'hash' ? 'file hash' : queryType === 'url' ? 'URL' : ''}...`}
          required
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        disabled={!query.trim()}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Analyze</span>
      </button>
    </form>
  );
} 