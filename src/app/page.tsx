"use client";

import { useState, Suspense } from "react";
import { ThreatInputForm } from "@/components/ThreatInputForm";
import { ThreatResults } from "@/components/ThreatResults";

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function HomeContent() {
  const [results, setResults] = useState<{ virusTotalData: unknown; gptSummary: string; score: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const loginSuccess = searchParams?.get('login');

  return (
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
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center">
            AI Threat Intelligence
          </h1>
        </div>
        <p className="text-gray-400 text-base md:text-lg text-center mt-1">
          Analyze IPs, domains, emails, and hashes with AI-powered security
        </p>
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
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
