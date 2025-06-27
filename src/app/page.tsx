"use client";

import { useState } from "react";
import { ThreatInputForm } from "@/components/ThreatInputForm";
import { ThreatResults } from "@/components/ThreatResults";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const [results, setResults] = useState<{ virusTotalData: unknown; gptSummary: string; score: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const loginSuccess = searchParams?.get('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {loginSuccess === 'success' && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center space-x-2 justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Welcome! You have successfully logged in.</span>
          </div>
        )}
        <div className="w-full flex flex-col gap-2 mb-6">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center">
                AI Threat Intelligence
              </h1>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              View Analytics
            </button>
          </div>
          <p className="text-gray-400 text-base md:text-lg text-center mt-1">
            Analyze IPs, domains, emails, and hashes with AI-powered security
          </p>
        </div>
        <div className="mb-8 text-center">
          {!session ? (
            <button
              onClick={() => signIn()}
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Sign Out ({session.user?.email})
            </button>
          )}
        </div>
        <div className="w-full bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/40 shadow-2xl p-8 space-y-6">
          <ThreatInputForm
            onResults={setResults}
            onLoading={setLoading}
          />
          {loading && (
            <div className="mt-6 text-center text-blue-400 animate-pulse">Analyzing...</div>
          )}
        </div>
        {results && !loading && (
          <div className="mt-10 w-full">
            <ThreatResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
}
