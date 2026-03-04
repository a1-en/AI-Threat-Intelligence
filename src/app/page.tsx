"use client";

import { useState, Suspense } from "react";
import { ThreatInputForm } from "@/components/ThreatInputForm";
import { ThreatResults } from "@/components/ThreatResults";

import { useSearchParams } from 'next/navigation';

import { useRouter } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const [results, setResults] = useState<{
    virusTotalData: any;
    relatedData?: any;
    gptSummary: string;
    score: number;
    queryType: string;
    query: string;
    lookupId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResults = (data: any) => {
    if (data.lookupId) {
      router.push(`/analysis/${data.lookupId}`);
    } else {
      setResults(data);
    }
  };
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
          onResults={handleResults}
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

      {/* Landing Page Content */}
      <div className="w-full mt-24 space-y-24 pb-20">
        {/* Features Preview */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Powerful Security Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-xl font-bold text-white mb-3">AI Powered</h3>
              <p className="text-gray-400 text-sm">Advanced machine learning models analyze results and provide human-readable summaries.</p>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-xl font-bold text-white mb-3">Global Intelligence</h3>
              <p className="text-gray-400 text-sm">Aggregated data from multiple security sources including VirusTotal and OSINT feeds.</p>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Scoring</h3>
              <p className="text-gray-400 text-sm">Get instant risk assessments and severity levels for any IP, domain, or file hash.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-800/30 rounded-3xl p-12 border border-gray-700/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">Three simple steps to professional threat intelligence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">1</div>
              <h4 className="text-white font-semibold mb-2">Input Query</h4>
              <p className="text-gray-400 text-sm">Enter an IP, domain, URL, or file hash into the analyzer.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">2</div>
              <h4 className="text-white font-semibold mb-2">AI Analysis</h4>
              <p className="text-gray-400 text-sm">Our system scans global databases and uses GPT to interpret the raw findings.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">3</div>
              <h4 className="text-white font-semibold mb-2">Get Results</h4>
              <p className="text-gray-400 text-sm">Receive a comprehensive report with risk scores and actionable insights.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">1M+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Threats Blocked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Detection Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50ms</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Monitoring</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 pt-24 min-h-screen flex flex-col items-center">
        <Suspense fallback={<div className="text-blue-500 animate-pulse">Loading platform...</div>}>
          <HomeContent />
        </Suspense>
      </div>
    </div>
  );
}
